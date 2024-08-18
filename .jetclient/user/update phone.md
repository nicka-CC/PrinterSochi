```toml
name = 'update phone'
method = 'PATCH'
url = 'http://localhost:7777/user/update-number'
sortWeight = 1000000
id = 'f04eaf76-83ea-41cc-a5a4-f5bba4c99d26'

[[headers]]
key = 'Content-Type'
value = 'application/json'

[[headers]]
key = 'Authorization'
value = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiI3NzciLCJlbWFpbCI6InRlc3RlcnMiLCJtb2RlcmF0ZSI6ZmFsc2UsImlhdCI6MTcyMzc1MjA4NCwiZXhwIjoxNzIzNzk1Mjg0fQ.qAubq4Xe1gTZZ0hILGXAd7cGYluByjZEeD7bRjXGkXw'

[body]
type = 'JSON'
raw = '''
{
  "phone": "001",
  "newPhone":  "111",
  "email": "testers",
  "checkPassword": "password"
}'''
```
