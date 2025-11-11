# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "K" [ref=e6] [cursor=pointer]:
      - /url: /dashboard
    - navigation [ref=e7]:
      - link "Search" [ref=e8] [cursor=pointer]:
        - /url: /search
      - link "List" [ref=e9] [cursor=pointer]:
        - /url: /dashboard
      - link "History" [ref=e10] [cursor=pointer]:
        - /url: /history
      - link "Explore" [ref=e11] [cursor=pointer]:
        - /url: /explore
    - generic [ref=e12]:
      - link "Log in" [ref=e13] [cursor=pointer]:
        - /url: /login
      - link "Sign up" [ref=e14] [cursor=pointer]:
        - /url: /register
        - button "Sign up" [ref=e15]
  - main [ref=e16]:
    - generic [ref=e18]:
      - heading "Enter Your Login Details" [level=2] [ref=e19]
      - generic [ref=e20]:
        - textbox "Enter your username" [ref=e22]: karanesh12345
        - textbox "Enter your password" [ref=e24]: karaneshkarruna
        - button "Login" [active] [ref=e25] [cursor=pointer]
        - paragraph [ref=e26]:
          - text: Don't have an account?
          - link "Register" [ref=e27] [cursor=pointer]:
            - /url: /register
```