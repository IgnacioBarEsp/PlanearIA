#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { preArchiveGate, preProposeGate } from "create-project-engineering-os/debt";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPECTED_VERSION = "0.1.5";
// Declaracion unica del contrato de consumo: no se deriva del owner de este repositorio, que puede diferir
// en un fork legitimo. Si el upstream se renombra, esta constante deja de coincidir y el contrato falla.
const EXPECTED_UPSTREAM = "IgnacioBarEsp/project-engineering-os";
const PACKAGE_ROOT = path.join(ROOT, "node_modules", "create-project-engineering-os");
const CLI = path.join(PACKAGE_ROOT, "bin", "project-os.mjs");
const OPEN_SPEC_ROOT = path.join(ROOT, "node_modules", "@fission-ai", "openspec");

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function runNode(args, { cwd = ROOT, expect = 0 } = {}) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
  assert.equal(
    result.status,
    expect,
    `project-os ${args.join(" ")} terminó ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  return result;
}

// La coincidencia de version entre manifiesto, lockfile, instalacion y CLI no prueba identidad: la release
// 0.1.4 era consistente en numero y declaraba un owner que ya no existe.
function assertUpstreamIdentity(pkg, expectedUpstream) {
  const fields = {
    "repository.url": pkg.repository?.url,
    homepage: pkg.homepage,
    "bugs.url": pkg.bugs?.url,
  };
  for (const [field, value] of Object.entries(fields)) {
    assert.equal(
      typeof value,
      "string",
      `El paquete instalado no declara ${field}; no puede verificarse la identidad del upstream.`,
    );
    assert.ok(
      value.includes(expectedUpstream),
      `${field} declara "${value}" y no resuelve a ${expectedUpstream}: la release fijada apunta a un upstream que no es el vigente.`,
    );
  }
}

function linkDirectory(target, destination) {
  mkdirSync(path.dirname(destination), { recursive: true });
  symlinkSync(target, destination, process.platform === "win32" ? "junction" : "dir");
}

const rootPackage = readJson(path.join(ROOT, "package.json"));
const rootLock = readJson(path.join(ROOT, "package-lock.json"));
const publicPackage = readJson(path.join(PACKAGE_ROOT, "package.json"));

assert.equal(rootPackage.devDependencies["create-project-engineering-os"], EXPECTED_VERSION);
assert.equal(
  rootLock.packages[""].devDependencies["create-project-engineering-os"],
  EXPECTED_VERSION,
);
assert.equal(
  rootLock.packages["node_modules/create-project-engineering-os"].version,
  EXPECTED_VERSION,
);
assert.equal(publicPackage.version, EXPECTED_VERSION);
assert.deepEqual(publicPackage.bin, {
  "create-project-engineering-os": "bin/project-os.mjs",
  "project-os": "bin/project-os.mjs",
});
assert.equal(typeof preArchiveGate, "function");
assert.equal(typeof preProposeGate, "function");

assertUpstreamIdentity(publicPackage, EXPECTED_UPSTREAM);

// Verificacion en negativo: una release con el owner anterior debe fallar aunque su version sea consistente.
assert.throws(
  () =>
    assertUpstreamIdentity(
      {
        version: EXPECTED_VERSION,
        repository: { url: "git+https://github.com/RitualBoat/project-engineering-os.git" },
        homepage: "https://github.com/RitualBoat/project-engineering-os#readme",
        bugs: { url: "https://github.com/RitualBoat/project-engineering-os/issues" },
      },
      EXPECTED_UPSTREAM,
    ),
  /repository\.url declara .* y no resuelve a /,
  "La verificacion de identidad debe fallar ante un owner anterior del upstream.",
);

// Un campo ausente tampoco puede pasar en silencio.
assert.throws(
  () => assertUpstreamIdentity({ version: EXPECTED_VERSION }, EXPECTED_UPSTREAM),
  /no declara repository\.url/,
  "La verificacion de identidad debe fallar cuando el paquete no declara los campos.",
);

const version = runNode(["--version"]).stdout.trim();
assert.equal(version, EXPECTED_VERSION);
const help = runNode(["--help"]).stdout;
for (const contract of ["bootstrap", "sync", "doctor", "upgrade", "debt"]) {
  assert.match(help, new RegExp(`\\b${contract}\\b`));
}

const fixture = mkdtempSync(path.join(os.tmpdir(), "planearia-project-os-consumer-"));
try {
  const gitInit = spawnSync("git", ["init", "--quiet"], { cwd: fixture, encoding: "utf8" });
  assert.equal(gitInit.status, 0, gitInit.stderr);

  const first = JSON.parse(
    runNode(["bootstrap", "--target", fixture, "--json"]).stdout,
  );
  assert.equal(first.status, "APPLIED");
  assert.equal(first.mutationPerformed, true);

  linkDirectory(
    PACKAGE_ROOT,
    path.join(fixture, "node_modules", "create-project-engineering-os"),
  );
  linkDirectory(
    OPEN_SPEC_ROOT,
    path.join(fixture, "node_modules", "@fission-ai", "openspec"),
  );

  const second = JSON.parse(
    runNode(["bootstrap", "--target", fixture, "--json"]).stdout,
  );
  assert.equal(second.status, "IN_SYNC");
  assert.equal(second.mutationPerformed, false);

  const sync = JSON.parse(
    runNode(["sync", "--target", fixture, "--check", "--json"]).stdout,
  );
  assert.equal(sync.status, "IN_SYNC");
  assert.equal(sync.mutationPerformed, false);

  const doctor = JSON.parse(
    runNode(["doctor", "--target", fixture, "--json"]).stdout,
  );
  assert.equal(doctor.verdict, "PASS");
  assert.equal(doctor.counts.FAIL, 0);
  assert.equal(
    doctor.results.find((entry) => entry.id === "release.identity")?.status,
    "PASS",
  );

  const debt = JSON.parse(
    runNode(["debt", "check", "--root", fixture, "--json"]).stdout,
  );
  assert.equal(debt.verdict, "PASS");

  const discovery = readJson(
    path.join(fixture, ".project-os", "github", "discovery-issues.json"),
  );
  assert.equal(discovery.issues.length, 10);
  assert.equal(
    discovery.issues[0].title,
    "[Discovery] Visión, problema y usuarios",
  );
  assert.equal(
    discovery.issues.at(-1).title,
    "[Change] Primera entrega vertical verificable",
  );

  assert.equal(
    existsSync(path.join(fixture, ".project-constructor", "state.json")),
    true,
  );
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

console.log(
  `Project OS consumer contract PASS: ${EXPECTED_VERSION}, bins, exports, bootstrap, idempotencia, sync/check, doctor, debt y 10 issues neutrales.`,
);
