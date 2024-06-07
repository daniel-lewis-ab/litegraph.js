# Rules

### This is our code style guide, we have rules and conventions here that cannot be included in linters

## Component structure

- We create components with [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) in mind
- Use **camelCase** for directories names
- Use **PascalCase** for components&pages filenames and and components&pages folders
- Basic component files structure:
  - `Component.tsx`
  - `Component.module.scss`
  - `Component.test.tsx`
- If you need to create any component in component or view that is not going to be shared or not worth having a
  dedicated story, create it in the same folder as component (if SubComponent needs another component, create it inside
  SubComponent folder):
  - Component folder
    - SubComponent folder
- Component file should only contain one stateful component, it can contain more but all other components should be
  stateless (without custom styles/types), if you need another stateful component - create new file for it
- Create only functional components
- If you need for example a hook that is used only by one component, put it into that component folder
- [Prefer for react types](https://twitter.com/dan_abramov/status/1308739731551858689):
  ```tsx
  import { CSSProperties } from 'react';
  type Props {
    style: CSSProperties;
  }
  ```
  over
  ```tsx
  type Props {
    style: React.CSSProperties;
  }
  ```

### Props

- [How to name props for React components](https://dlinau.wordpress.com/2016/02/22/how-to-name-props-for-react-components)
- With boolean props, prefer a false default. Example of hiding a legend, defaulted to visible (in JSX, existence =
  true):

  ```jsx
  // 👎
  <Fieldset showLegend={false} />

  // 👍
  <Fieldset hideLegend />
  ```

- [Avoid the boolean trap](https://spicefactory.co/blog/2019/03/26/how-to-avoid-the-boolean-trap-when-designing-react-components/) -
  Avoid using booleans that may conflict. Instead, accept an "enum" for mutually exclusive options. Example, accept a
  buttonType prop with a list of potential string values like `'primary' | 'secondary'`, etc, rather than `isPrimary`,
  `isSecondary`.

## Typescript

- When declaring a function, use `onChange(): void` instead of `onChange: VoidFunction`, that way typescript will catch
  that it's a function and order in in proper way (properties first, later function)
- When declaring function in type, prefer shorter `resetFilters(): void;` instead of `resetFilters: () => void;`
- When declaring props type - be specific. Start required. Loosen as needed.
- Prefer required type properties first (properties first, methods later - that will be corrected by eslint):

  ```ts
  // 👎
  export type TabButtonProps = {
    isActive?: boolean;
    children: ReactNode;
    onPress?(): void;
    onClick(): void;
  };

  // 👍
  export type TabButtonProps = {
    children: ReactNode;
    isActive?: boolean;
    onClick(): void;
    onPress?(): void;
  };
  ```

- Don't use React.FC - write your own type if you need it

  ```ts
  // 👎
  export const Test: React.FC<TestProps> = () => {};

  // 👍
  export const Test = (props: TestProps) => {};
  ```

  - Don't write `Type` in type name

  ```ts
  // 👎
  export type ComponentType = {};

  // 👍
  export type ComponentProps = {};
  ```

- Avoid writing types for static objects, instead of:

  ```ts
  type ColorsTypes = {
    blue: string;
    red: string;
  };

  const colors: ColorsTypes = {
    blue: 'blue',
    red: 'red',
  };
  ```

  just write:

  ```ts
  const colors = {
    blue: 'blue',
    red: 'red',
  };

  type ColorsTypes = typeof colors;
  ```

## Hooks

- If you use state, be consistent with naming, every state should have: `[name, setName] = useState(...)` - setter name
  should always include the same name as state variable

## Context

- Use context effectively -
  [How to use react context effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively) - no need to use it every time, only when we really care about rerenders or there are issues caused by them
- When reading from context, use specifically created hooks for that like `useLocale`, `useAuth` etc. - avoid using
  `useContext(ContextName)`

## Dependencies

- If you want to add any dependencies, first make sure that you are not able to do that functionality by yourself
- Add dependency only as a last resort. Before installing it check all dependencies of that package, bundle size and if it is still maintained
- Check that package code, if it's not big - we can consider adding it to our codebase
- If you are sure you need to add that dependency, write about it on Slack channel: `Hello guys, I am adding library X to our deps`

## Comments

1. If something needs to be updated, add `@TODO` comment
1. If you are doing some workaround to fix a library bug - add link to that github bug and describe the problem
1. Don't add redundant comments:

   ```ts
   // Response
   const response;
   ```

1. If you cannot avoid writing not understandable code, write comment describing what is happening there
1. Don't comment code - remove it, git will remember it

## Misc

- Write semantic HTML
- If you are removing code - make sure you also remove all it dependencies
- If you are waiting for data in your dump component, prefer if's in that order `if (error)`, `if (loading)`, render component
- Prefer using double negation `!!` over `Boolean()` to cast value to boolean
- Avoid using js breakpoints like `if (viewport.minMd)`, use CSS breakpoints if possible
- Avoid using `useMemo` too much, use it only if you are doing expensive calculations or that value is going to be in dependencies list and is causing a lot of rerenders ([when to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback))
- If you are using `innerHTML` remember to sanitize string that is going to be passed to it
- If you are fixing a functionality bug, prefer Red/Green/Refactor principle (first write test that fail, then fix code and make that test working - [Red/Green/Refactor pattern](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html))
- Use named exports instead of default export (to be explicit over implicit)
- Don't create index.ts file only with exports - [Tree shaking issue](https://github.com/vercel/next.js/issues/12557)
- If an urgent need arises and we lack the time to apply all the rules outlined in this document, please add an @TODO comment or create a ticket to address this later.

## General

1. Be consistent
2. Code with single responsibility rule in mind
3. Keep It Simple Stupid (KISS)
4. [Avoid Hasty Abstractions (AHA)](https://kentcdodds.com/blog/aha-programming)

## Branches

- Branch naming pattern: `task_with_id_short-description-of-task` for example `SALTE-1030_deployment-discord` where `SALTE-1030` is linear work item id
