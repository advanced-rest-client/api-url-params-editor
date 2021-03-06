[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-url-params-editor.svg)](https://www.npmjs.com/package/@api-components/api-url-params-editor)

[![Build Status](https://travis-ci.com/advanced-rest-client/api-url-params-editor.svg)](https://travis-ci.org/advanced-rest-client/api-url-params-editor)

## &lt;api-url-params-editor&gt;

An element to render query / URI parameters form from AMF data model.

It also allows to create custom query parameters list, outside schema definition, when `allowCustom` property is set.

It uses [api-url-data-model](https://github.com/advanced-rest-client/api-url-data-model) to transform AMF model to the view model recognized by this element.

The main task of the element is to produce / update view model for both query / URI parameters so it can be used by the URL editor to create final request URL value.

```html
<api-url-params-editor
  querymodel="..."
  pathmodel="..."
></api-url-params-editor>
```

## Deprecation notice

This element is moved to `api-url` repository and `@api-components/api-url` package. This element will be deprecated and archived once the migration finish.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```
npm install --save @api-components/api-url-params-editor
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-url-params-editor/api-url-params-editor.js';
    </script>
  </head>
  <body>
    <api-url-params-editor></api-url-params-editor>
    <script>
    {
      const editor = document.querySelector('api-url-params-editor');
      editor.onurivalue = (e) {
        console.log('URI values', e.detail.value);
      };
      editor.onqueryvalue = (e) {
        console.log('Query values', e.detail.value);
      };
    }
    </script>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-url-params-editor/api-url-params-editor.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <api-url-params-editor
      .queryModel="${this.queryModel}"
      .pathModel="${this.pathModel}"
      @queryvalue-changed="${this._queryValueChanged}"
      @urivalue-changed="${this._uriValueChanged}"
      @urimodel-changed="${this._pathModelChangeHandler}"
      @querymodel-changed="${this._queryModelChangeHandler}"></api-url-params-editor>
    `;
  }

  _queryValueChanged(e) {
    this.queryValues = e.detail.value;
  }

  _uriValueChanged(e) {
    this.uriValues = e.detail.value;
  }

  _pathModelChangeHandler(e) {
    this.pathViewModel = e.detail.value;
  }

  _queryModelChangeHandler(e) {
    this.queryViewModel = e.detail.value;
  }
}
customElements.define('sample-element', SampleElement);
```

### Passing AMF data model

The component does not directly interact with AMF model. It uses a view model generated by [api-url-data-model](https://github.com/advanced-rest-client/api-url-data-model). This element parses API spec to produce basic information about currently selected endpoint like path variables model, query parameters model, and base URI.

Your UI has to provide a way to select an endpoint. You can use [api-navigation](https://github.com/advanced-rest-client/api-navigation) element which renders API structure in a nav bar and dispatches selection event.

#### In an html file

```html
<api-url-editor></api-url-editor>
<api-url-params-editor></api-url-params-editor>
<api-url-data-model></<api-url-data-model>

<script type="module">
import '@api-components/api-url-editor/api-url-editor.js';
import '@api-components/api-url-params-editor/api-url-params-editor.js';
import '@api-components/api-url-data-model/api-url-data-model.js';

{
  const api = await generateApiModel();
  const selectedEndpoint = 'amf://id#63'; // some ID from the AMF model for endpoint / operation

  const model = document.querySelector('api-url-data-model');
  model.amf = api; // This is required to compute ld+json keys!
  model.selected = selectedEndpoint;

  const urlEditor = document.querySelector('api-url-editor');
  urlEditor.baseUri = model.apiBaseUri;
  urlEditor.endpointPath = model.endpointPath;
  urlEditor.queryModel = model.queryModel;
  urlEditor.pathModel = model.pathModel;

  const editor = document.querySelector('api-url-params-editor');
  urlEditor.queryModel = model.queryModel;
  urlEditor.uriModel = model.pathModel;
  urlEditor.onquerymodel = (e) => {
    urlEditor.queryModel = e.detail.value;
  };
  urlEditor.onurimodel = (e) => {
    urlEditor.pathModel = e.detail.value;
  };
}
</script>
```

## Development

```sh
git clone https://github.com/advanced-rest-client/api-url-params-editor
cd api-url-params-editor
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
