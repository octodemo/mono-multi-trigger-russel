### Issue: Workflow Run Error Investigation

#### Description
In the recent workflow run (see [link](https://github.com/octodemo/mono-multi-trigger-russel/actions/runs/17103701312/job/48506902899)), an error was encountered:

```
Unable to process file command 'output' successfully. Invalid format '  "service-a",'.
```

#### Request
We need to investigate and correct the output format in the deployment workflow. The goal is to ensure that services are handled correctly.

#### Steps to Reproduce
1. Trigger a deployment workflow.
2. Observe the error in the workflow run logs.

#### Expected Outcome
The output format should be valid, allowing the workflow to process the file command successfully.