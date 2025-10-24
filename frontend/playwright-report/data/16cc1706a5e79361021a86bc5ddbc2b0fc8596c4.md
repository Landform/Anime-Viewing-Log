# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "K" [ref=e6]:
      - /url: /dashboard
    - navigation [ref=e7]:
      - link "Search" [ref=e8]:
        - /url: /search
      - link "List" [ref=e9]:
        - /url: /dashboard
      - link "History" [ref=e10]:
        - /url: /history
      - link "Explore" [ref=e11]:
        - /url: /explore
    - generic [ref=e12]:
      - link "Log in" [ref=e13]:
        - /url: /login
      - link "Sign up" [ref=e14]:
        - /url: /register
        - button "Sign up" [ref=e15] [cursor=pointer]
  - main [ref=e16]:
    - generic [ref=e17]:
      - generic [ref=e18]:
        - img "One Piece" [ref=e19]
        - generic [ref=e20]:
          - heading "My Progress" [level=4] [ref=e21]
          - paragraph [ref=e22]: "Status: Watching"
          - generic [ref=e23]:
            - button "-" [disabled] [ref=e24]
            - generic [ref=e25]: 0 / 1000
            - button "+" [ref=e26] [cursor=pointer]
      - generic [ref=e27]:
        - heading "One Piece" [level=1] [ref=e28]
        - paragraph [ref=e29]: "Status: Airing | Episodes: 1000"
        - heading "Synopsis" [level=2] [ref=e30]
        - paragraph [ref=e31]: No synopsis available.
```