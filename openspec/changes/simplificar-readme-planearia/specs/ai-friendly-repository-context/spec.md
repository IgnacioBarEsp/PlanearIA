## MODIFIED Requirements

### Requirement: Agent entrypoints route to the current SDD workflow
The repository SHALL provide separate, progressive entrypoints: `README.md` for understanding and trying PlanearIA, and the active documentation hierarchy for AI agents and technical collaborators that need architecture, OpenSpec SDD, validation, or code-intelligence guidance.

#### Scenario: Codex starts from AGENTS
- **WHEN** Codex starts by reading `AGENTS.md`
- **THEN** it can identify `CLAUDE.md`, `Documentacion/README.md`, `openspec/config.yaml`, the approved knowledge-graph/tooling policy, GitHub issue tracking, OpenSpec changes, and mandatory evidence gates

#### Scenario: Visitor starts from README
- **WHEN** any visitor opens `README.md`
- **THEN** the first sections explain in plain Spanish why the author created PlanearIA, what the product is, how it looks, and which problems it is intended to reduce
- **AND** the visitor is not addressed as a recruiter, evaluator, collaborator, or AI agent

#### Scenario: Technical reader needs more detail
- **WHEN** a reader wants architecture, development, or operational information
- **THEN** `README.md` links to `Documentacion/README.md` instead of duplicating the internal runbook

#### Scenario: Lightweight assistant reads Copilot instructions
- **WHEN** GitHub Copilot or a similar assistant reads `.github/copilot-instructions.md`
- **THEN** it receives the same critical SDD, architecture, validation, no-secrets, `src/sync`, `userId`, `aiGateway`, and approved code-intelligence rules as the other technical front doors

## ADDED Requirements

### Requirement: Public README presents PlanearIA as a normal software project
The public README SHALL use concise, natural language and a product-first order so a reader can understand the project without reading a professional pitch or internal operating guide.

#### Scenario: Reader scans the README
- **WHEN** the reader follows the document from top to bottom
- **THEN** the order is product description, product explanation, screenshots, main functions, ways to try it, technologies, current status, license, and author

#### Scenario: Professional profile is reached
- **WHEN** the reader reaches the final author section
- **THEN** it contains a short first-person profile and contact as supplemental information
- **AND** the rest of the README does not frame product capabilities as evidence for hiring

### Requirement: Public README separates the current app from the vision in development
The public README SHALL show deployed guest evidence and Figma vision in different sections so the implementation state is clear.

#### Scenario: Reader inspects the current application
- **WHEN** the reader reaches the current screenshots
- **THEN** the README shows three verified captures from the public guest flow with brief factual captions

#### Scenario: Reader inspects the Figma vision
- **WHEN** the reader reaches “Visión en desarrollo”
- **THEN** the README shows the three candidate captures and links to the prototype
- **AND** it states that those screens are not the final application interface

### Requirement: Reader can try PlanearIA without a development environment
The public README SHALL provide stable routes to the hosted guest experience and the latest Android release without requiring source setup.

#### Scenario: Reader chooses the web version
- **WHEN** the reader follows the web instructions
- **THEN** the README links to `https://planearai.com` and explains that guest access does not require account creation

#### Scenario: Reader chooses Android
- **WHEN** the reader follows the Android instructions
- **THEN** the README links to the latest GitHub Release and explains how to identify the `.apk` asset

### Requirement: Public presentation protects privacy and accessibility
The README SHALL use only public or synthetic visual evidence, provide meaningful text alternatives, and express the current-versus-vision distinction in text.

#### Scenario: Screenshot is published
- **WHEN** a screenshot is included in the README
- **THEN** it contains no credentials, tokens, browser tooling, private sessions, student data, school data, or private documents

#### Scenario: Images are unavailable
- **WHEN** an image does not load or is read through assistive technology
- **THEN** its alt text and surrounding caption still identify the surface and whether it is current or in development

### Requirement: Developer profile remains factual and secondary
The final README section SHALL identify Ignacio Barboza Espinoza as a junior software developer focused on React Native, TypeScript, and Node.js, and provide `IgnacioBar.esp@gmail.com`.

#### Scenario: Reader reaches the author section
- **WHEN** the author information is displayed
- **THEN** it mentions UX/UI, automated testing, SDD, and GitNexus as practices used while developing PlanearIA
- **AND** it contains no company, vacancy, LinkedIn, phone, schedule, availability, compensation, or employment-specific request
