# CS 450: CI/CD Practice Workshop (`cs450-workshop-cicd`)

Welcome to the Continuous Integration (CI) Workshop! This is a single-package Node.js project designed exclusively to practice configuring GitHub Actions, interpreting logs, and implementing a failure-to-fix validation cycle.

**Objectives for today's 30-minute workshop:**
1. Fork and inspect a workshop repository.
2. Build a local workflow configuration from scratch.
3. Diagnose and repair pre-staged codebase errors using raw logs.
4. Achieve a verified green badge.

---

## Phase 1: Setup & Inspect (5 Mins)

1. **Fork this repository** to your personal GitHub account.
2. **Clone your fork** locally to your machine:
   ```bash
   git clone git@github.com:<YOUR_GITHUB_USERNAME>/cs450-workshop-cicd.git
   cd cs450-workshop-cicd
   ```
3. **Install dependencies locally:** This ensures you use the project's exact ESLint and Jest versions instead of your system defaults.
   ```bash
   npm install
   ```
4. **Create a new branch** to isolate your workflow setup:
   ```bash
   git checkout -b setup-ci
   ```
5. **Inspect the package configuration:** Open `package.json` in your editor. Locate the `scripts` block and identify the automated checks configured for this app:
   - `npm run lint` (Checks for strict code formatting)
   - `npm run test` (Runs the test suite)
   - `npm run build` (Compiles the project)

---

## Phase 2: Writing the Workflow (10 Mins)

GitHub Actions looks for YAML configuration files located strictly inside the `.github/workflows/` directory of your repository.

1. Create the necessary nested directories in your project root:
   ```bash
   mkdir -p .github/workflows
   ```
2. Inside that directory, create a file named `workshop-ci.yml`.
3. Open `workshop-ci.yml` and write a workflow definition that implements the following constraints:
   - **Triggers:** Runs automatically on every `push` to your `setup-ci` branch.
   - **Security:** Grants the runner explicit read-only access (`contents: read`) to the codebase.
   - **Environment:** Provisions a fresh virtual machine running the latest Ubuntu release and Node.js version 20.
   - **Steps:** Runs checkout, configures Node caching, installs clean dependencies via `npm ci`, and executes `lint`, `test`, and `build` in sequence.

### Your Workflow Draft:
```yaml
name: Workshop CI Validation

on:
  push:
    branches: [setup-ci]

permissions:
  contents: read

jobs:
  verify-code:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v4

      - name: Set up Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run code linter
        run: npm run lint

      - name: Run test suite
        run: npm run test

      - name: Run build step
        run: npm run build
```

4. **Save, commit, and push** your configuration to GitHub:
   ```bash
   git add .github/workflows/workshop-ci.yml
   git commit -m "feat: add workshop validation workflow"
   git push origin setup-ci
   ```

---

## Phase 3: The Instructive Failure (10 Mins)

1. Open your repository fork on GitHub.com and navigate to the **Actions** tab.
2. Select your recent commit pipeline run. Watch it build and inevitably **turn red (Fail)**.
3. Click into the `verify-code` job log to inspect the failure:
   - Look for the **earliest actionable error**. 
   - Note how a failure at an early step (like linting) halts the execution of all remaining steps (like tests or building).

### 💡 AI Lab Connection
This is the perfect moment to test your diagnostic prompt pattern. Copy the raw error text from the failed step block and plug it into your AI assistant along with the following prompt pattern:

> *"Using only this workflow, package script, and redacted Actions log, identify the earliest actionable error. Separate evidence from hypotheses. Suggest the smallest fix and one command or workflow run that would verify it. Do not rewrite unrelated steps."*

---

## Phase 4: The Focused Fix (5 Mins)

Do not disable or bypass the scripts to pass the checks. Fix the underlying codebase issues step-by-step.

### Step 4.1: Fixing the Linter
1. Locate the file and line number highlighted in the failed `Run code linter` step log.
2. Correct the stylistic formatting error or syntax violation in your editor.
3. Save, commit, and push the fix:
   ```bash
   git add .
   git commit -m "fix: resolve code linter violations"
   git push origin setup-ci
   ```
4. Return to the Actions tab. The linter step should now turn **green**, but the workflow will likely fail on the next block: the unit tests.

### Step 4.2: Fixing the Test Assertions
1. Open the runner logs for the newly failed test run.
2. Read the assertion mismatch details (expected vs. received output values).
3. Find the associated test file in your project directory and correct the logic or the assertion.
4. Save, commit, and push your final fix:
   ```bash
   git add .
   git commit -m "fix: repair failing component unit assertions"
   git push origin setup-ci
   ```

5. **Verify the Green Status:** Watch the pipeline rerun. Confirm that **every single check** runs cleanly to completion and displays a green checkmark.

---

## Key Takeaways for your Individual Assignment 2
- A passing pipeline is only as good as the checks it validates. If you don't run lint or test scripts, a green check is meaningless.
- Always analyze the *first* error in the step log sequence; cascading failures afterwards are typically symptoms, not the root cause.
- Keep production credentials out of validation runners, and always use explicit minimal scopes (`contents: read`) to maintain strict repo boundaries.
