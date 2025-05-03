 * https://stackoverflow.com/questions/58613492/how-to-resolve-cannot-use-import-statement-outside-a-module-from-jest-when-run
 * https://dev.to/rubymuibi/jest-and-vite-cannot-use-importmeta-outside-a-module-24n3
 * https://www.npmjs.com/package/babel-plugin-transform-import-meta
 * 


```
filename.test.js
```
tag filename.test.js for jest.


```
npm test
```

```js
{
  "name": "forum-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "jsonwebtoken": "^9.0.0",
    "better-sqlite3": "^9.0.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```