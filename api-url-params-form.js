import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {IronValidatableBehavior} from '@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import {ApiFormMixin} from '@api-components/api-form-mixin/api-form-mixin.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@api-components/api-form-mixin/api-form-styles.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/marked-element/marked-element.js';
import '@api-components/api-property-form-item/api-property-form-item.js';
import '@advanced-rest-client/markdown-styles/markdown-styles.js';
import '@polymer/paper-button/paper-button.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import './api-url-params-custom-input.js';
/**
 * Renders form and input elements for query / uri model.
 *
 * Handles creation of form elements, validation, and rendering documentation.
 *
 * This element **requires** you to set `form-type` attribute to either
 * `uri` or `query` to distinguish type of form. Also, set `form-title`
 * property to render a title. It is useful when adding two forms right after
 * each other.
 *
 * ## Optional parameters
 *
 * By default the element renders all form valus. For better user experience,
 * set `allow-hide-optional` attribute to hide parameters that are optional.
 * It also renders checkbox to toggle optional parameters.
 *
 * Styling
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-url-params-form` | Mixin applied to this element | `{}`
 * `--api-url-params-form-row` | Mixin applied to each form row | `{}`
 * `--api-url-params-form-required` | Mixin applied to a form row that is required | `{}`
 * `--inline-documentation-color` | Color of the documentation when opened. | `rgba(0, 0, 0, 0.87)`
 * `--from-row-action-icon-color` | Color of the documentation icon | `--icon-button-color` or `rgba(0, 0, 0, 0.74)`
 * `--from-row-action-icon-color-hover` | Color of the documentation icon when hovering. Please, consider devices that do not support hovers. | `--accent-color` or `rgba(0, 0, 0, 0.74)`
 * `--inline-documentation-background-color` | Background color of opened documentation. | `#FFF3E0`
 * `--api-url-params-form-array-parameter` | Mixin applied to a container of a parameter that is an array | `{}`
 * `--api-url-params-editor-editor-subheader` | Mixin applied to the form header element | `{}`
 * `--api-url-params-editor-optional-checkbox-label-color,` | Label color of toggle optional checkbox | `rgba(0, 0, 0, 0.74)`
 * `--api-url-params-form-enable-checkbox-margin-top` | Margin top of the toggle checkbox | `32px`
 * `--api-url-params-form-enable-checkbox-array-margin-top` | Margin top of the toggle checkbox when the item is an array | `40px`
 * `--api-url-params-form-hint-icon-margin-top` | Margin top of the "help" icon | `16px`
 * `--api-url-params-form-hint-icon-array-margin-top` | Margin top of the "help" icon when the item is an array| `24px`
 * `--hint-trigger-color` | Color of the help icon | `rgba(0, 0, 0, 0.74)`
 * `--hint-trigger-hover-color` | Color of the help icon when hovering | `rgba(0, 0, 0, 0.88)`
 * `--icon-button` | Mixin applied to all icon buttons | `{}`
 * `--icon-button-hover` | Mixin applied to all icon buttons when hovering | `{}`
 *
 * You can also style inputs as defined in
 * [api-property-form-item](https://github.com/advanced-rest-client/api-property-form-item)
 * element documentation.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @polymerBehavior Polymer.IronValidatableBehavior
 * @appliesMixin ApiFormMixin
 */
class ApiUrlParamsForm extends
  mixinBehaviors([IronValidatableBehavior], ApiFormMixin(PolymerElement)) {
  static get template() {
    return html`<style include="api-form-styles"></style>
    <style include="markdown-styles">
    :host {
      display: block;
      @apply --raml-request-parameters-form;
      @apply --api-url-params-form;
    }

    .param-value {
      @apply --raml-request-parameters-editor-row;
      @apply --api-url-params-form-row;
    }

    .param-value.optional {
      display: none;
    }

    .param-value.required {
      @apply --api-url-params-form-required;
    }

    .param-value.optional.with-optional {
      display: block;
    }

    .param-value .input {
      @apply --layout-horizontal;
      @apply --layout-flex;
    }

    .has-enable-button .docs {
      margin-left: 32px;
    }

    .value-input {
      @apply --layout-horizontal;
      @apply --layout-start;
      @apply --layout-flex;
    }

    .value-input.is-array {
      @apply --layout-end;
      @apply --raml-request-parameters-form-array-parameter;
      @apply --api-url-params-form-array-parameter;
    }

    api-property-form-item,
    api-url-params-custom-input {
      @apply --layout-flex;
      margin-bottom: 8px;
    }

    api-property-form-item[is-array] {
      margin-top: 8px;
    }

    [hidden] {
      display: none !important;
    }

    .enable-checkbox {
      margin-top: var(--api-url-params-form-enable-checkbox-margin-top, 32px);
      margin-right: 8px;
    }

    .enable-checkbox[data-array] {
      margin-top: var(--api-url-params-form-enable-checkbox-array-margin-top, 40px);
    }

    .params-title {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .toggle-checkbox {
      --paper-checkbox-label-color: var(--api-url-params-editor-optional-checkbox-label-color, rgba(0, 0, 0, 0.74));
    }

    .param-value paper-icon-button {
      margin-top: var(--api-url-params-form-hint-icon-margin-top, 16px);
    }

    .param-value paper-icon-button[data-array] {
      margin-top: var(--api-url-params-form-hint-icon-array-margin-top, 24px);
    }

    .params-title ::slotted(h3) {
      display: inline-block;
      margin-right: 12px;
      @apply --api-url-params-editor-editor-subheader;
    }
    </style>
    <div class="params-title">
      <slot name="title"></slot>
      <template is="dom-if" if="[[renderOptionalCheckbox]]">
        <paper-checkbox class="toggle-checkbox" checked="{{optionalOpened}}"
          title="Shows or hides optional parameters">Show optional parameters</paper-checkbox>
      </template>
    </div>
    <iron-form>
      <form enctype="application/json">
        <dom-repeat items="{{model}}" items-repeater="">
          <template>
            <div class\$="[[computeFormRowClass(item, allowHideOptional, optionalOpened, allowDisableParams)]]">
              <div class\$="value-input [[_computeTypeClass(item.isArray)]]">
                <template is="dom-if" if="[[allowDisableParams]]">
                  <paper-checkbox class="enable-checkbox" data-array\$="[[item.schema.isArray]]"
                    checked="{{item.schema.enabled}}" title="Enable/disable this header"></paper-checkbox>
                </template>
                <template is="dom-if" if="[[!_computeIsCustom(item.schema)]]">
                  <api-property-form-item model="[[item]]" name="[[item.name]]"
                    value="{{item.value}}" required\$="[[item.required]]"></api-property-form-item>
                </template>
                <template is="dom-if" if="[[_computeIsCustom(item.schema)]]">
                  <api-url-params-custom-input model="[[item]]" name="{{item.name}}"
                    value="{{item.value}}" required\$="[[item.required]]"
                    narrow="[[narrow]]"></api-url-params-custom-input>
                </template>
                <template is="dom-if" if="[[_computeHasDocumentation(noDocs, item)]]">
                  <!-- TODO: The documentation should be computed on a transformer level. -->
                  <paper-icon-button class="hint-icon"
                    data-array\$="[[item.schema.isArray]]" icon="arc:help" on-click="_openDocs"
                    title="Display documentation"></paper-icon-button>
                </template>
                <template is="dom-if" if="[[_computeIsCustom(item.schema)]]">
                  <paper-icon-button title="Remove parameter" data-array\$="[[item.schema.isArray]]"
                    class="delete-icon action-icon" icon="arc:remove-circle-outline"
                    on-click="_removeCustom"></paper-icon-button>
                </template>
              </div>
              <template is="dom-if" if="[[_computeHasDocumentation(noDocs, item)]]">
                <div class="docs">
                  <iron-collapse>
                    <marked-element markdown="[[_computeDocumentation(item)]]">
                      <div slot="markdown-html" class="markdown-body"></div>
                    </marked-element>
                  </iron-collapse>
                </div>
              </template>
            </div>
          </template>
        </dom-repeat>
      </form>
    </iron-form>
    <template is="dom-if" if="[[allowCustom]]">
      <div class="add-action">
        <paper-button class="action-button" on-click="add" title="Adds new query parameter to the form">
          <iron-icon class="action-icon" icon="arc:add-circle-outline" alt="Add query parameter icon"></iron-icon>
          Add query parameter
        </paper-button>
      </div>
    </template>`;
  }
  static get is() {
    return 'api-url-params-form';
  }
  static get properties() {
    return {
      /**
       * The form can display query or URI parameters. When anything change in the form
       * it will send a corresponding custom event (`query-parameter-changed` or
       * `uri-parameter-changed`). To make this happen set the value of this property to
       * either `query` or `uri`.
       */
      formType: String,
      /**
       * Prohibits rendering of the documentation (the icon and the
       * description).
       */
      noDocs: {
        type: Boolean,
        value: false
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._ensureAttribute('role', 'form');
  }
  /**
   * Computes array class for the input element.
   *
   * @param {Boolean} isArray
   * @return {String}
   */
  _computeTypeClass(isArray) {
    return isArray ? 'is-array' : '';
  }
  // Opens the documentation for item.
  _openDocs(e) {
    const form = this._getForm();
    const template = form.querySelector('[items-repeater]');
    const model = template.modelForElement(e.target);
    const collapse = form.querySelector('.param-value:nth-child(' + (model.index + 1) +
      ') iron-collapse');
    if (!collapse) {
      return;
    }
    collapse.opened = !collapse.opened;
  }
  /**
   * Computes documentation as a markdown to be placed in the `marked-element`
   * @param {Object} item View model
   * @return {String}
   */
  _computeDocumentation(item) {
    let docs = '';
    if (item.description) {
      docs += item.description;
    }
    if (!item.schema) {
      return docs;
    }
    const schema = item.schema;
    docs += '\n\n\n';
    if (schema.pattern) {
      docs += '- Pattern: `' + schema.pattern + '`\n';
    }
    if (schema.examples && schema.examples.length) {
      schema.examples.forEach((item) => {
        docs += '- Example';
        if (item.hasName) {
          docs += ' ' + item.name;
        }
        docs += ': `' + item.value + '`\n';
      });
    }
    return docs;
  }
  /**
   * Computes if model item has documentation to display.
   * @param {Boolean} noDocs If set it always cancels docs
   * @param {Object} item Model item
   * @return {Boolean} True if documentation can be rendered.
   */
  _computeHasDocumentation(noDocs, item) {
    if (noDocs) {
      return false;
    }
    if (item.hasDescription) {
      return true;
    }
    if (!item.schema) {
      return false;
    }
    const schema = item.schema;
    if (schema.pattern) {
      return true;
    }
    if (schema.examples && schema.examples.length) {
      return true;
    }
    return false;
  }

  _computeIsCustom(schema) {
    if (!schema || !schema.isCustom) {
      return false;
    }
    return true;
  }
  /**
   * Adds custom property to the list.
   */
  add() {
    this.addCustom('query');
  }

  // Overidden from Polymer.IronValidatableBehavior. Will set the `invalid`
  // attribute automatically, which should be used for styling.
  _getValidity() {
    return this.shadowRoot.querySelector('iron-form').validate();
  }
}

window.customElements.define(ApiUrlParamsForm.is, ApiUrlParamsForm);
