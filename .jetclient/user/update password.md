```toml
name = 'update password'
method = 'PATCH'
url = 'http://localhost:7777/user/update-password'
sortWeight = 4000000
id = '505edf28-64e9-45d2-ae6c-c523f900df9a'

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
  "newPassword":  "111",
  "email": "111",
  "checkPassword": "password"
}'''
```
