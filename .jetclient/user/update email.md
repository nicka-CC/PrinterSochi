```toml
name = 'update email'
method = 'PATCH'
url = 'http://localhost:7777/user/update-email'
sortWeight = 2000000
id = 'adc4cf3f-fb08-45d9-9cc3-1048b1a608f1'

[[headers]]
key = 'Content-Type'
value = 'application/json'

[[headers]]
key = 'Authorization'
value = 'Baerer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIxMTEiLCJlbWFpbCI6InRlc3RlcnMiLCJtb2RlcmF0ZSI6ZmFsc2UsImlhdCI6MTcyMzc5MTA1OCwiZXhwIjoxNzIzODM0MjU4fQ.cS1Gy0NMNawjMM4wzvmEQWZbffy5MHDBkhaJvQk1vVI'

[body]
type = 'JSON'
raw = '''
{
  "phone": "111",
  "newEmail":  "111",
  "email": "testers",
  "checkPassword": "password"
}'''
```
