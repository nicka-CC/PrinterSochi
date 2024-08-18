```toml
name = 'postIR'
method = 'POST'
url = 'http://localhost:7777/instReviews/post'
sortWeight = 1000000
id = '0373df06-7974-420e-b2e1-7e94c461a70c'

[[headers]]
key = 'Content-Type'
value = 'application/json'

[[headers]]
key = 'Authorization'
value = 'Baerer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIxMTEiLCJlbWFpbCI6IjExMSIsIm1vZGVyYXRlIjp0cnVlLCJpYXQiOjE3MjM4MDY1MzcsImV4cCI6MTcyMzg0OTczN30.047espnkgLJ-O2obN5Y8zxA1OcuXYgG4EOA2U4KcOE0'

[body]
type = 'JSON'
raw = '''
{
  "images": "1"
}'''
```
