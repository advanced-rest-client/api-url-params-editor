import { html, LitElement } from 'lit-element';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin/validatable-mixin.js';
import { ApiFormMixin, apiFormStyles } from '@api-components/api-form-mixin/index.js';
import markdownStyles from '@advanced-rest-client/markdown-styles/markdown-styles.js';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import { help, removeCircleOutline, addCircleOutline } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@api-components/api-property-form-item/api-property-form-item.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-collapse/iron-collapse.js';
import styles from './ApiUrlParamsFormStyles.js';


/** @typedef {import('@api-components/api-view-model-transformer/src/ApiViewModel').ModelItem} ModelItem */
/** @typedef {import('@polymer/iron-form').IronFormElement} IronFormElement */

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
 * You can also style inputs as defined in
 * [api-property-form-item](https://github.com/advanced-rest-client/api-property-form-item)
 * element documentation.
 *
 * @mixin ApiFormMixin
 * @mixin ValidatableMixin
 * @extends LitElement
 */
export class ApiUrlParamsForm extends ApiFormMixin(ValidatableMixin(LitElement)) {
  get styles() {
    return [
      markdownStyles,
      apiFormStyles,
      styles,
    ];
  }

  _customInputTemplate(item, index) {
    const {
      readOnly,
      compatibility,
      outlined,
      narrow
    } = this;
    return html`
    <div class="custom-row${narrow ? ' narrow' : ''}">
      <anypoint-input
        data-index="${index}"
        .value="${item.name}"
        @value-changed="${this._nameChangeHandler}"
        class="param-name"
        type="text"
        required
        autovalidate
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        .readOnly="${readOnly}"
        invalidmessage="Parameter name is required">
        <label slot="label">Parameter name</label>
      </anypoint-input>
      <api-property-form-item
        data-index="${index}"
        .name="${item.name}"
        .value="${item.value}"
        @value-changed="${this._valueChangeHandler}"
        .model="${item}"
        .readOnly="${readOnly}"
        ?narrow="${narrow}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"></api-property-form-item>
    </div>`;
  }

  _formRowTemplate(item, index) {
    const {
      allowHideOptional,
      optionalOpened,
      allowDisableParams,
      readOnly,
      disabled,
      compatibility,
      outlined,
      narrow,
      noDocs
    } = this;
    const rowClass = this.computeFormRowClass(item, allowHideOptional, optionalOpened, allowDisableParams);
    const hasDocs = this._computeHasDocumentation(noDocs, item);
    const renderDocs = !noDocs && hasDocs && !!item.docsOpened;
    return html`<div class="${rowClass}" ?data-optional="${!item.required}">
      <div class="value-input${item.schema.isArray ? ' is-array' : ''}">
      ${allowDisableParams ? html`
        <anypoint-checkbox
          class="enable-checkbox"
          ?checked="${item.schema.enabled}"
          data-index="${index}"
          ?data-array="${item.schema.isArray}"
          @checked-changed="${this._enableCheckedHandler}"
          title="Enable or disable this parameter"
          aria-label="Toggle to enable or disable this parameter"
          ?disabled="${readOnly || disabled}"
          ?outlined="${outlined}"
          ?compatibility="${compatibility}"></anypoint-checkbox>` : undefined}

        ${item.schema.isCustom ? this._customInputTemplate(item, index) :
          html`<api-property-form-item
            data-index="${index}"
            name="${item.name}"
            .value="${item.value}"
            @value-changed="${this._valueChangeHandler}"
            .model="${item}"
            ?required="${item.required}"
            .readOnly="${readOnly}"
            .disabled="${disabled}"
            ?narrow="${narrow}"
            .noDocs="${noDocs}"
            ?outlined="${outlined}"
            ?compatibility="${compatibility}"
            ></api-property-form-item>`}
        ${hasDocs ? html`<anypoint-icon-button
          data-index="${index}"
          class="hint-icon"
          title="Toggle documentation"
          ?outlined="${outlined}"
          ?compatibility="${compatibility}"
          ?disabled="${disabled}"
          @click="${this._toggleItemDocs}"
        >
          <span class="icon">${help}</span>
        </anypoint-icon-button>` : undefined}

        ${item.schema.isCustom ? html`<anypoint-icon-button
          title="Remove this parameter"
          aria-label="Press to remove parameter ${name}"
          class="action-icon delete-icon"
          data-index="${index}"
          @click="${this._removeCustom}"
          slot="suffix"
          ?disabled="${readOnly || disabled}"
          ?outlined="${outlined}"
          ?compatibility="${compatibility}"
        >
          <span class="icon">${removeCircleOutline}</span>
        </anypoint-icon-button>` : undefined}
      </div>

      ${renderDocs ? html`<arc-marked .markdown="${this._computeDocumentation(item)}" sanitize>
        <div slot="markdown-html" class="markdown-body"></div>
      </arc-marked>` : undefined}
    </div>`;
  }

  render() {
    const {
      renderOptionalCheckbox,
      optionalOpened,
      allowCustom,
      readOnly,
      disabled,
      styles,
      model=[],
    } = this;
    return html`
    <style>${styles}</style>
    <div class="params-title">
      <slot name="title"></slot>
    </div>
    ${renderOptionalCheckbox ? html`<div class="optional-checkbox">
      <anypoint-checkbox
        class="toggle-checkbox"
        .checked="${optionalOpened}"
        @checked-changed="${this._optionalHanlder}"
        title="Toggles optional parameters">Show optional parameters</anypoint-checkbox>
    </div>` : undefined}
    <iron-form>
      <form enctype="application/json">
      ${model.map((item, index) => this._formRowTemplate(item, index))}
      </form>
    </iron-form>
    ${allowCustom ? html`<div class="add-action">
      <anypoint-button
        class="action-button"
        @click="${this.add}"
        title="Add new parameter"
        aria-label="Press to create a new parameter"
        ?disabled="${readOnly || disabled}"
      >
        <span class="icon action-icon">${addCircleOutline}</span>
        Add parameter
      </anypoint-button>
    </div>` : undefined}`;
  }

  static get properties() {
    return {
      /**
       * Prohibits rendering of the documentation (the icon and the
       * description).
       */
      noDocs: { type: Boolean },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * @deprecated Use `compatibility` instead
       */
      legacy: { type: Boolean },
      /**
       * Enables Material Design outlined style
       */
      outlined: { type: Boolean },
      /**
       * When set the editor is in read only mode.
       */
      readOnly: { type: Boolean },
      /**
       * When set all controls are disabled in the form
       */
      disabled: { type: Boolean },
      /**
       * If set it renders a narrow layout
       */
      narrow: { type: Boolean, reflect: true },
      /**
       * When set, renders add custom parameter button in query parameters
       * form
       */
      allowCustom: { type: Boolean }
    };
  }

  get legacy() {
    return this.compatibility;
  }

  set legacy(value) {
    this.compatibility = value;
  }

  constructor() {
    super();

    this.noDocs = false;
    this.readOnly = false;
    this.disabled = false;
    this.compatibility = false;
    this.outlined = false;
    this.narrow = false;
    this.allowHideOptional = false;
    this.allowDisableParams = false;
    this.allowCustom = false;
  }

  /**
   * Computes documentation as a markdown to be placed in the `marked-element`
   * @param {Object} item View model
   * @return {String}
   */
  _computeDocumentation(item) {
    return (item.extendedDescription ? item.extendedDescription : item.description) || '';
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
    return !!(item.hasDescription || item.hasExtendedDescription);
  }
  /**
   * Adds custom property to the list.
   */
  add() {
    // URI form has no add button.
    this.addCustom('query');
  }

  // Overrides ValidatableMixin._getValidity. Will set the `invalid`
  // attribute automatically, which should be used for styling.
  _getValidity() {
    const form = /** @type IronFormElement */ (this.shadowRoot.querySelector('iron-form'));
    if (!form) {
      return true;
    }
    return form.validate();
  }

  _optionalHanlder(e) {
    this.optionalOpened = e.detail.value;
  }

  _enableCheckedHandler(e) {
    const index = Number(e.target.dataset.index);
    /* istanbul ignore if  */
    if (index !== index) {
      return;
    }
    const { checked } = e.target;
    const item = /** @type ModelItem */ (this.model[index]);
    const old = item.schema.enabled;
    item.schema.enabled = checked;
    this._notifyChange(index, 'enabled', checked, old);
  }

  _nameChangeHandler(e) {
    if (!this.allowCustom) {
      return;
    }
    const index = Number(e.target.dataset.index);
    /* istanbul ignore if  */
    if (index !== index) {
      return;
    }
    const item = /** @type ModelItem */ (this.model[index]);
    if (!item.schema.isCustom) {
      return;
    }
    const { value } = e.detail;
    const old = item.name;
    item.name = value;
    this._notifyChange(index, 'name', value, old);
  }

  _valueChangeHandler(e) {
    const index = Number(e.target.dataset.index);
    /* istanbul ignore if  */
    if (index !== index) {
      return;
    }
    const { value } = e.detail;
    const item = /** @type ModelItem */ (this.model[index]);
    const old = item.value;
    item.value = value;
    this._notifyChange(index, 'value', value, old);
  }

  _notifyChange(index, property, value, oldValue) {
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        index,
        property,
        value,
        oldValue
      }
    }));
  }

  /**
   * Handler for the docs toggle click.
   * @param {CustomEvent} e
   */
  _toggleItemDocs(e) {
    const target = /** @type HTMLElement */ (e.currentTarget);
    const index = Number(target.dataset.index);
    /* istanbul ignore if  */
    if (index !== index) {
      return;
    }
    this.model[index].docsOpened = !this.model[index].docsOpened;
    this.requestUpdate();
  }

  /**
   * Overrides `ApiFormMixin._removeCustom`.
   * Calls the super method and dispatches `delete` event.
   * @param {CustomEvent} e
   */
  _removeCustom(e) {
    const target = /** @type HTMLElement */ (e.currentTarget);
    const index = Number(target.dataset.index);
    if (index !== index) {
      return;
    }
    const model = /** @type ModelItem[] */ (this.model);
    if (!model || !model.length) {
      return;
    }
    const item = model[index];
    super._removeCustom(e);
    this.dispatchEvent(new CustomEvent('delete', {
      detail: {
        name: item.name
      }
    }));
  }
}
