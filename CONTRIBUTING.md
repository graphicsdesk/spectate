# Contributing to Spectate

Make sure you have completed the [prequisite and setup instructions](https://github.com/spec-journalism/spectate#prerequisites) for Spectate. Then, create a Spectate project with a slug like `test-feature-nerdbox`.

We use ESLint for JavaScript linting. Please [integrate it](https://eslint.org/docs/user-guide/integrations) into your text editor.

To add a new HTML partial (visual element) onto the site, see the section [Writing components](#writing-components).

## Writing components

1. Refer to a Spectate project's [Usage](https://github.com/spec-journalism/spectate#usage) instructions.

2. In the Spectate project, the `/src/partials` directory contains all of Spectate's built-in UI components. Add a new one named `methodology.html`.

3. To see `methodology.html` on the page, add the component as a case inside the `<each loop="item in body">` element in `src/index.html`. After you've done that, it should look like this:

```html
  <div class="story">
    <each loop="item in body">
      <switch expression="item.type">
        <case n="'methodology'">
          <include src="partials/methodology.html"></include>
        </case>
        <case n="'text'">
          <include src="partials/paragraph.html"></include>
        </case>
        ...
```

4. In the Google Doc, add text inside `[+body]` that looks like this:

```
methodology: Your methodology
```

5. Write the component. Styles should go in `/src/styles.scss`. In the component, you can load the text you wrote in the Google Doc by writing `{{ item.value }}`. (Don't forget to run `spectate download` after you've changed the Google Doc!)
