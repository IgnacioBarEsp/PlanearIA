## MODIFIED Requirements

### Requirement: FTS repair is isolated from tracked agent context

The repository SHALL provide a single explicit GitNexus recovery command that restores index freshness, full-text search capability and structural resolvability together, using an approved CLI invocation that confines generated changes to the local GitNexus index. The recovery command SHALL NOT report success while leaving the index classified as `stale`, and SHALL NOT report success while the shared structural verification still fails against the restored index. A structural verification that cannot complete SHALL be treated as unresolved, never as absence of a known failure. When a freshness-restoring reindex leaves the structural fixture unresolved, the recovery command SHALL escalate to a full rebuild of the local index; the rebuilt index SHALL be held to the same post-conditions as the initial reindex, namely no full-text search diagnostic, a `fresh` classification and a resolved structural fixture. If any of those post-conditions still fails after the rebuild, or if the rebuild itself cannot be performed, the recovery SHALL fail naming the unmet condition. The repository SHALL NOT expose a second parallel recovery command; the documented recovery sequence SHALL be that command followed by the structural verification command, and the documented cleanup procedure SHALL remain available for the case where the recovery command itself fails.

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

#### Scenario: The structural verification cannot complete

- **WHEN** the shared structural verification cannot produce a verdict because its command fails outright
- **THEN** the recovery command treats the fixture as unresolved and escalates to the full rebuild
- **AND** it does not exit on the underlying error without attempting the rebuild

#### Scenario: The full rebuild leaves a post-condition unmet

- **WHEN** the escalated full rebuild completes but the index is classified as `stale`, emits a full-text search diagnostic, or still fails the shared structural verification
- **THEN** the recovery command fails and names the unmet condition as the cause
- **AND** it does not fall back to reporting the index as recovered because the fixture resolved or because the reindex exited successfully

#### Scenario: The full rebuild cannot be performed

- **WHEN** the escalated rebuild cannot delete or reindex the local index
- **THEN** the recovery command fails naming that step, not the fixture it was trying to restore
- **AND** the documented cleanup procedure remains the operator's route for a failed recovery

#### Scenario: Repair leaves unexpected tracked changes

- **WHEN** the repair workflow detects tracked agent-context changes after execution
- **THEN** verification fails and reports the changed paths
- **AND** the workflow does not accept the repair as complete
