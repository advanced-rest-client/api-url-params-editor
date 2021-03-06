import { html, LitElement } from 'lit-element';
import { ValidatableMixin } from '@anypoint-web-components/validatable-mixin/validatable-mixin.js';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '../api-url-params-form.js';
import styles from './ApiUrlParamsEditorStyles.js';

/** @typedef {import('@api-components/api-view-model-transformer/src/ApiViewModel').ModelItem} ModelItem */

/**
 * `api-url-params-editor`
 * An element to render query / uri parameters form from AMF schema
 *
 *
 * @mixes EventsTargetMixin
 * @mixes ValidatableMixin
 * @extends LitElement
 */
export class ApiUrlParamsEditor extends ValidatableMixin(EventsTargetMixin(LitElement)) {
  get styles() {
    return styles;
  }

  render() {
    const {
      uriModel,
      queryModel,
      noDocs,
      readOnly,
      disabled,
      compatibility,
      outlined,
      narrow,
      allowCustom,
      _hasParameters,
      _hasUriParameters,
      _hasQueryParameters
    } = this;
    return html`<style>${this.styles}</style>
    ${_hasParameters ? undefined : html`<section class="empty-message">
      <p>This endpoint doesn't declare query or URI parameters.</p>
    </section>`}

    ${_hasUriParameters ? html`<api-url-params-form
      id="uriParametersForm"
      @change="${this._uriFormChange}"
      form-type="uri"
      optionalopened
      .model="${uriModel}"
      .readOnly="${readOnly}"
      .disabled="${disabled}"
      ?nodocs="${noDocs}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?narrow="${narrow}">
      <div role="heading" aria-level="1" slot="title">URI parameters</div>
    </api-url-params-form>` : undefined}
    ${_hasQueryParameters ? html`<api-url-params-form
      id="queryParametersForm"
      @change="${this._queryFormChange}"
      @delete="${this._queryDeleted}"
      @model-changed="${this._queryModelHandler}"
      form-type="query"
      allowhideoptional
      allowdisableparams
      ?allowcustom="${allowCustom}"
      .model="${queryModel}"
      .readOnly="${readOnly}"
      .disabled="${disabled}"
      ?nodocs="${noDocs}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?narrow="${narrow}">
      <div role="heading" aria-level="1" slot="title">Query parameters</div>
    </api-url-params-form>` : undefined}
    `;
  }

  static get properties() {
    return {
      /**
       * Computed by `api-view-model-transformer` qury parameters model.
       *
       * Note, this element won't accept AMF data.
       */
      queryModel: { type: Array },
      /**
       * Computed value if the `queryParameters` are set.
       * Use `raml-request-parameteres-model` to compute this value.
       */
      _hasQueryParameters: { type: Boolean },
      /**
       * Computed by `api-view-model-transformer` URI parameters model.
       *
       * Note, this element won't accept AMF data.
       */
      uriModel: { type: Array },
      /**
       * Computed value if the `uriParameters` are set.
       * Use `raml-request-parameteres-model` to compute this value.
       */
      _hasUriParameters: { type: Boolean },
      /**
       * Computed value if `uriParameters` or `queryParameters` are set.
       * Use `raml-request-parameteres-model` to compute this value.
       */
      _hasParameters: { type: Boolean },
      /**
       * Map of uri parameters produced by this element.
       */
      uriValue: { type: Object },
      /**
       * Map of query parameters produced by this element.
       */
      queryValue: { type: Object },
      /**
       * When set, renders add custom parameter button in query parameters
       * form
       */
      allowCustom: { type: Boolean },
      /**
       * Renders forms in "narrow" view
       */
      narrow: { type: Boolean },
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
       * When set the editor disabled all controls
       */
      disabled: { type: Boolean }
    };
  }

  get legacy() {
    return this.compatibility;
  }

  set legacy(value) {
    this.compatibility = value;
  }

  get allowCustom() {
    return this._allowCustom;
  }

  set allowCustom(value) {
    const old = this._allowCustom;
    /* istanbul ignore if  */
    if (old === value) {
      return;
    }
    this._allowCustom = value;
    this.requestUpdate();
    this._hasQueryParameters = this._computeHasData(this.queryModel, value);
    this._hasParameters = this._computeHasParameters(
        this._hasQueryParameters, this._hasUriParameters, value);
  }

  get queryModel() {
    return this._queryModel;
  }

  set queryModel(value) {
    const old = this._queryModel;
    /* istanbul ignore if  */
    if (old === value) {
      return;
    }
    this._queryModel = value;
    this.requestUpdate();
    this._hasQueryParameters = this._computeHasData(value, this.allowCustom);
    this._hasParameters = this._computeHasParameters(
        this._hasQueryParameters, this._hasUriParameters, this.allowCustom);
    this._updateModelValue('query');
  }

  get uriModel() {
    return this._uriModel;
  }

  set uriModel(value) {
    const old = this._uriModel;
    /* istanbul ignore if  */
    if (old === value) {
      return;
    }
    this._uriModel = value;
    this.requestUpdate();
    this._hasUriParameters = this._computeHasData(value);
    this._hasParameters = this._computeHasParameters(
        this._hasQueryParameters, this._hasUriParameters, this.allowCustom);
    this._updateModelValue('uri');
  }

  get uriValue() {
    return this._uriValue;
  }

  set uriValue(value) {
    const old = this._uriValue;
    /* istanbul ignore if  */
    if (old === value) {
      return;
    }
    this._uriValue = value;
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('urivalue-changed', {
      detail: {
        value
      }
    }));
  }

  get queryValue() {
    return this._queryValue;
  }

  set queryValue(value) {
    const old = this._queryValue;
    /* istanbul ignore if  */
    if (old === value) {
      return;
    }
    this._queryValue = value;
    this.requestUpdate();

    this.dispatchEvent(new CustomEvent('queryvalue-changed', {
      detail: {
        value
      }
    }));
  }
  /**
   * @return {EventListener} Previously registered handler for `urivalue-changed` event
   */
  get onurivalue() {
    return this['_onurivalue-changed'];
  }
  /**
   * Registers a callback function for `urivalue-changed` event
   * @param {EventListener} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onurivalue(value) {
    this._registerCallback('urivalue-changed', value);
  }
  /**
   * @return {EventListener} Previously registered handler for `queryvalue-changed` event
   */
  get onqueryvalue() {
    return this['_onqueryvalue-changed'];
  }
  /**
   * Registers a callback function for `queryvalue-changed` event
   * @param {EventListener} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onqueryvalue(value) {
    this._registerCallback('queryvalue-changed', value);
  }
  /**
   * @return {EventListener} Previously registered handler for `urimodel-changed` event
   */
  get onurimodel() {
    return this['_onurimodel-changed'];
  }
  /**
   * Registers a callback function for `urimodel-changed` event
   * @param {EventListener} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onurimodel(value) {
    this._registerCallback('urimodel-changed', value);
  }
  /**
   * @return {EventListener} Previously registered handler for `querymodel-changed` event
   */
  get onquerymodel() {
    return this['_onquerymodel-changed'];
  }
  /**
   * Registers a callback function for `querymodel-changed` event
   * @param {EventListener} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onquerymodel(value) {
    this._registerCallback('querymodel-changed', value);
  }
  /**
   * Registers an event handler for given type
   * @param {String} eventType Event type (name)
   * @param {EventListener} value The handler to register
   */
  _registerCallback(eventType, value) {
    const key = `_on${eventType}`;
    if (this[key]) {
      this.removeEventListener(eventType, this[key]);
    }
    if (typeof value !== 'function') {
      this[key] = null;
      return;
    }
    this[key] = value;
    this.addEventListener(eventType, value);
  }

  constructor() {
    super();
    this._queryParamChangeHandler = this._queryParamChangeHandler.bind(this);
    this._uriParamChangeHandler = this._uriParamChangeHandler.bind(this);

    this.noDocs = false;
    this.readOnly = false;
    this.disabled = false;
    this.compatibility = false;
    this.outlined = false;
    this.narrow = false;
  }

  _attachListeners(node) {
    node.addEventListener('uri-parameter-changed', this._uriParamChangeHandler);
    node.addEventListener('query-parameter-changed', this._queryParamChangeHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('uri-parameter-changed', this._uriParamChangeHandler);
    node.removeEventListener('query-parameter-changed', this._queryParamChangeHandler);
  }

  /**
   * Handler for the `query-parameter-changed` custom event.
   * Updates model value from the event
   *
   * @param {CustomEvent} e
   */
  _queryParamChangeHandler(e) {
    if (e.composedPath()[0] === this || e.defaultPrevented) {
      return;
    }
    this._appyEventValues(e.detail, 'query');
  }

  _uriParamChangeHandler(e) {
    if (e.composedPath()[0] === this || e.defaultPrevented) {
      return;
    }
    this._appyEventValues(e.detail, 'uri');
  }
  /**
   * Applies values from the change event to a model.
   *
   * @param {Object} detail Detail event object
   * @param {String} type `uri` or `query`
   */
  _appyEventValues(detail, type) {
    const modelPath = `${type}Model`;
    const model = /** @type ModelItem[] */ (this[modelPath]);
    if (!model || !model.length) {
      return;
    }
    const index = model.findIndex((item) => item.name === detail.name);
    if (index === -1) {
      return;
    }
    const item = model[index];
    item.value = detail.value;
    if (item.schema.enabled === false) {
      item.schema.enabled = true;
    }
    this[modelPath] = [...model];
    this._notifyModelChange(type);
  }

  /**
   * Dispatches an event to inform that the uri/query model changed.
   * @param {String} type `uri` or `query`
   */
  _notifyModelChange(type) {
    const etype = `${type}model-changed`;
    const modelPath = `${type}Model`;
    const value = /** @type ModelItem[] */ (this[modelPath]);

    this.dispatchEvent(new CustomEvent(etype, {
      detail: {
        value
      }
    }));
  }

  /**
   * Computes boolean value if the argument exists and has items.
   *
   * @param {Array<any>} model Current url model.
   * @param {Boolean=} allowCustom
   * @return {Boolean}
   */
  _computeHasData(model, allowCustom) {
    if (allowCustom) {
      return true;
    }
    return !!(model instanceof Array && model.length);
  }
  /**
   * Computes value for `hasParameters` property.
   *
   * @param {Boolean} qp State of `_hasQueryParameters`
   * @param {Boolean} up State of `_hasUriParameters`
   * @param {Boolean} allowCustom
   * @return {Boolean} True if any of the arguments is true
   */
  _computeHasParameters(qp, up, allowCustom) {
    return !!(qp || up) || !!allowCustom;
  }

  /**
   * Overidden from ValidatableMixin. Will set the `invalid`
   * attribute automatically, which should be used for styling.
   * @return {Boolean}
   */
  _getValidity() {
    let validUri = true;
    let validUrl = true;
    if (this._hasUriParameters) {
      const uriForm = this.shadowRoot.querySelector('#uriParametersForm');
      // @ts-ignore
      validUri = uriForm ? uriForm.validate() : true;
    }
    if (this._hasQueryParameters) {
      const urlForm = this.shadowRoot.querySelector('#queryParametersForm');
      // @ts-ignore
      validUrl = urlForm ? urlForm.validate() : true;
    }
    return validUri && validUrl;
  }
  /**
   * Updates value for entire model.
   * @param {String} type Data model type. `query` or `uri`
   */
  _updateModelValue(type) {
    if (this.__ignoreValueProcessing) {
      // Simple optimisation to stop value processing when value was already
      // set.
      return;
    }
    const valuePath = `${type}Value`;
    const modelPath = `${type}Model`;
    const model = /** @type ModelItem[] */ (this[modelPath]);

    if (!model || !model.length) {
      this[valuePath] = undefined;
      return;
    }
    const result = {};
    model.forEach((item) => {
      const enabled = item.schema && item.schema.enabled;
      if (enabled === false) {
        return;
      }
      result[item.name] = item.value;
    });
    this[valuePath] = result;
    this._asyncValidate();
  }

  _uriFormChange(e) {
    this._formChange('uri', e.detail);
  }

  _queryFormChange(e) {
    this._formChange('query', e.detail);
  }

  _formChange(type, detail) {
    const valuePath = `${type}Value`;
    const modelPath = `${type}Model`;
    const model = /** @type ModelItem[] */ (this[modelPath]);
    const values = this[valuePath] || {};
    const { property, index } = detail;
    switch (property) {
      case 'enabled':
        this._updatePropertyEnabled(model, values, detail);
        break;
      case 'name':
        this._updatePropertyName(values, detail);
        break;
      case 'value':
        this._updatePropertyValue(values, model, detail);
        break;
    }
    this[valuePath] = Object.assign({}, values);
    this.__ignoreValueProcessing = true;
    this[modelPath] = /** @type ModelItem[] */ ([...model]);
    this.__ignoreValueProcessing = false;
    this._asyncValidate();
    this._notifyChange(type, model[index]);
    this._notifyModelChange(type);
  }

  _updatePropertyEnabled(model, values, detail) {
    const { index, value } = detail;
    const item = /** @type ModelItem */ (model[index]);
    if (value) {
      values[item.name] = item.value;
    } else {
      delete values[item.name];
    }
  }

  _updatePropertyName(values, detail) {
    const { value, oldValue } = detail;
    const currentValue = values[oldValue] || '';
    delete values[oldValue];
    values[value] = currentValue;
  }

  _updatePropertyValue(values, model, detail) {
    const { index, value } = detail;
    const item = /** @type ModelItem */ (model[index]);
    values[item.name] = value;
  }

  /**
   * Handler for the query model change from the editor.
   * @param {CustomEvent} e
   */
  _queryModelHandler(e) {
    this.queryModel = /** @type ModelItem[] */ (e.detail.value);
    this._asyncValidate();
    this._notifyModelChange('query');
  }

  async _asyncValidate() {
    await this.updateComplete;
    setTimeout(() => {
      // @ts-ignore
      this.validate();
    });
  }
  /**
   * Handler for the `query` event dispatchd from the query form.
   * @param {CustomEvent} e
   */
  _queryDeleted(e) {
    const item = {
      name: e.detail.name,
      schema: {
        enabled: false
      }
    };
    this._notifyChange('query', item, true);
  }
  /**
   * Dispatches uri/query-parameter-changed custom event when model property change.
   * @param {String} type Model type, `uri` or `query`
   * @param {Object} item Changed item
   * @param {Boolean=} removed True if the item has been removed from the UI
   */
  _notifyChange(type, item, removed) {
    let enabled = item.schema && item.schema.enabled;
    let isCustom = item.schema && item.schema.isCustom;
    if (typeof enabled !== 'boolean') {
      enabled = true;
    }
    if (typeof isCustom !== 'boolean') {
      isCustom = false;
    }
    const detail = {
      name: item.name,
      isCustom
    };
    if (removed) {
      detail.removed = true;
    } else {
      detail.value = item.value;
      detail.enabled = enabled;
    }
    const ev = new CustomEvent(type + '-parameter-changed', {
      detail,
      cancelable: true,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(ev);
  }
  /**
   * Fired when an URI parameter value change in this editor.
   *
   * @event uri-parameter-changed
   * @param {String} name The name of the parameter
   * @param {String} value The value of the parameter
   * @param {Boolean} enabled True if the parameter is enabled in the form.
   */
  /**
   * Fired when a query parameter value change in this editor.
   *
   * @event query-parameter-changed
   * @param {String} name The name of the parameter
   * @param {?String} value The value of the parameter
   * @param {?Boolean} enabled True if the parameter is enabled in the form.
   * @param {?Boolean} removed True when custom header has been removed.
   * When set `value` and `emabled` properties are not set.
   */
}
