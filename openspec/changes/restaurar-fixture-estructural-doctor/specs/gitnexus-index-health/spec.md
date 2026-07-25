## MODIFIED Requirements

### Requirement: FTS repair is isolated from tracked agent context

The repository SHALL provide a single explicit GitNexus recovery command that restores index freshness, full-text search capability and structural resolvability together, using an approved CLI invocation that confines generated changes to the local GitNexus index. The recovery command SHALL NOT report success while leaving the index classified as `stale`, and SHALL NOT report success while the shared structural verification still fails against the restored index. When a freshness-restoring reindex leaves the structural fixture unresolved, the recovery command SHALL escalate to a full rebuild of the local index and re-evaluate the structural verification before reporting any outcome; if the fixture remains unresolved after that rebuild, the recovery SHALL fail with the unresolved fixture as its stated cause. The repository SHALL NOT expose a second parallel recovery command; the documented recovery sequence SHALL be that command followed by the structural verification command.

#### Scenario: Repair succeeds without agent-file injection

- **WHEN** an agent runs the approved recovery command for PlanearIA
- **THEN** it rebuilds the local index and its full-text search capability without an extension error
- **AND** it does not modify tracked `AGENTS.md`, `CLAUDE.md`, generated Copilot instructions, or GitNexus skills

#### Scenario: Recovery restores freshness

- **WHEN** the approved recovery command completes successfully on a checkout whose index was classified as `stale`
- **THEN** the subsequent status diagnostic classifies the index as `fresh` at the current commit
- **AND** the structural verification command succeeds against that index

#### Scenario: Recovery reports success without restoring freshness

- **WHEN** the recovery command exits successfully but the index remains classified as `stale`
- **THEN** the recovery is treated as failed and reports the persisting staleness
- **AND** the workflow does not accept the recovery as complete

#### Scenario: A fresh index does not resolve the structural fixture

- **WHEN** the reindex step of the recovery command exits successfully and the index is classified as `fresh`, but the shared structural verification does not resolve the UID-disambiguated impact fixture
- **THEN** the recovery command does not report success on the strength of freshness alone
- **AND** it escalates to a full rebuild of the local index instead of returning
- **AND** an index that is up to date and therefore reindexed as a no-op is not accepted as recovered

#### Scenario: The full rebuild restores the structural fixture

- **WHEN** the escalated full rebuild completes and the shared structural verification then resolves both the known query and the UID-disambiguated impact fixture
- **THEN** the recovery command reports success
- **AND** the restored fixture is the same UID the verification already required, without relaxing its kind or its exactness

#### Scenario: The full rebuild does not restore the structural fixture

- **WHEN** the escalated full rebuild completes and the shared structural verification still fails
- **THEN** the recovery command fails and names the unresolved fixture as the cause
- **AND** it does not fall back to reporting the index as recovered because it is fresh

#### Scenario: Repair leaves unexpected tracked changes

- **WHEN** the repair workflow detects tracked agent-context changes after execution
- **THEN** verification fails and reports the changed paths
- **AND** the workflow does not accept the repair as complete
