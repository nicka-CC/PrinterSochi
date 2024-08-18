```toml
name = 'update fullName'
method = 'PATCH'
url = 'http://localhost:7777/user/update-fullName'
sortWeight = 3000000
id = '07bb38ef-a9d3-495b-b0ac-95ac1cb860e7'

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
  "newName":  "111",
  "email": "111",
  "checkPassword": "password"
}'''
```
