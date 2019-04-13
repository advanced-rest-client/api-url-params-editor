import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '../../@polymer/polymer/lib/legacy/class.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import {IronValidatableBehavior} from '../../@polymer/iron-validatable-behavior/iron-validatable-behavior.js';
import {EventsTargetMixin} from '../../@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-checkbox/paper-checkbox.js';
import './api-url-params-form.js';
/**
 * `api-url-params-editor`
 * An element to render query / uri parameters form from AMF schema
 *
 * This element is to replace `raml-request-parameters-editor` which can
 * only work with RAML parser custom data model.
 *
 * Use `api-url-params-editor` to generate pre-populated form of query and
 * uri paramters for an API endpoint. It accepts
 * [AMF](https://github.com/mulesoft/amf)
 * json/ld model for an API to render the view.
 *
 * This element works together with `api-url-editor`. Both elements uses
 * the same view data model generated by
 * [api-view-model-transformer]
 * (https://github.com/advanced-rest-client/api-view-model-transformer)
 * element. Because of that neither this or `api-url-editor` does not include
 * the transformer since they both work with the same data model.
 * If you use this elements separatelly you have to use the transformer
 * to generate the view data model.
 *
 * This element does not produce URL for the endpoint. It informs other
 * elements about user input by:
 * - updating the data model with user input and propagate those changes
 * through the listeners
 * - sending `uri-parameter-changes` and `query-parameter-changed` events.
 *
 * The element that generates full URL for the endpoint is `api-url-editor`
 * that listens for the change events and updates URL value.
 *
 * This element listens for the change events and updates values (without
 * notifications) if values are different.
 *
 * Use `eventsTarget` property to scope events to a single node.
 *
 * For special cases you may want to use this element and handle events
 * manually, without using `api-url-input`. If not, then it's easier to
 * use `api-request-editor` and an element tah bound all request editors
 * togeter and produce commong HTTP request object.
 *
 * ## Example
 *
 * See demo page for full example, including AMF model to view model
 * transformation.
 *
 * ```html
 * <!-- Inside Polymer element / app -->
 * <api-view-model-transformer
 *  amf-model="[[queryAmfModel]]"
 *  view-model="{{queryModel}}"></api-view-model-transformer>
 * <api-view-model-transformer
 *  amf-model="[[uriAmfModel]]"
 *  view-model="{{uriModel}}"></api-view-model-transformer>
 * <api-url-params-editor
 *  query-model="[[queryModel]]"
 *  uri-model="[[uriModel]]"></api-url-params-editor>
 * ```
 *
 * ## Custom mode
 *
 * The element allows the user to define custom set of query parameters.
 * It renders a button to add query parameter that is not defined in
 * AMF model.
 *
 * With this mode enabled it always shows query parameters form. Therefore
 * it won't show message that the endpoint does not requires parameters.
 *
 * ```html
 * <api-url-params-editor allow-custom></api-url-params-editor>
 * ```
 *
 * ## Styling
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-url-params-editor` | Mixin applied to this element | `{}`
 * `--api-url-params-editor-no-params` | Applied to "empty info" message | `{}`
 * `--api-url-params-editor-no-params-message` | Applied to "empty info"
 * label | `{}`
 * `--api-request-parameters-editor-row` | Applied to custom form row | `{}`
 * `--api-request-parameters-editor-row-narrow` | Applied to custom form row
 * when narrow | `{}`
 *
 * See styles for the form and custom input for more styling API.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @demo demo/custom.html Cutom parameters
 * @memberof ApiElements
 * @polymerBehavior Polymer.IronValidatableBehavior
 * @appliesMixin EventsTargetMixin
 */
class ApiUrlParamsEditor extends
  mixinBehaviors([IronValidatableBehavior], EventsTargetMixin(PolymerElement)) {
  static get template() {
    return html`<style>
    :host {
      display: block;
      @apply --raml-request-parameters-editor;
      @apply --api-url-params-editor;
    }

    .empty-message {
      @apply --raml-request-parameters-editor-no-params;
      @apply --api-url-params-editor-no-params;
    }

    .empty-message p {
      @apply --raml-request-parameters-editor-no-params-message;
      @apply --api-url-params-editor-no-params-message;
    }

    [hidden] {
      display: none !important;
    }
    </style>
    <section hidden\$="[[hasParameters]]" role="region" class="empty-message">
      <p>This endpoint doesn't require to declare query or URI parameters.</p>
    </section>
    <template is="dom-if" if="[[hasUriParameters]]">
      <api-url-params-form id="uriParametersForm" role="region"
        form-type="uri" model="{{uriModel}}" optional-opened="" no-docs="[[noDocs]]">
        <h3 slot="title">URI parameters</h3>
      </api-url-params-form>
    </template>
    <template is="dom-if" if="[[hasQueryParameters]]">
      <api-url-params-form id="queryParametersForm" role="region"
        allow-hide-optional="" allow-disable-params="" allow-custom="[[allowCustom]]"
        form-type="query" model="{{queryModel}}" narrow="[[narrow]]" no-docs="[[noDocs]]">
        <h3 slot="title">Query parameters</h3>
      </api-url-params-form>
    </template>`;
  }

  static get is() {
    return 'api-url-params-editor';
  }
  static get properties() {
    return {
      /**
       * Computed by `api-view-model-transformer` qury parameters model.
       *
       * Note, this element won't accept AMF data.
       */
      queryModel: Array,
      /**
       * Computed value if the `queryParameters` are set.
       * Use `raml-request-parameteres-model` to compute this value.
       */
      hasQueryParameters: {
        type: Boolean,
        computed: '_computeHasData(queryModel, allowCustom)'
      },
      /**
       * Computed by `api-view-model-transformer` URI parameters model.
       *
       * Note, this element won't accept AMF data.
       */
      uriModel: Array,
      /**
       * Computed value if the `uriParameters` are set.
       * Use `raml-request-parameteres-model` to compute this value.
       */
      hasUriParameters: {
        type: Boolean,
        computed: '_computeHasData(uriModel)'
      },
      /**
       * Computed value if `uriParameters` or `queryParameters` are set.
       * Use `raml-request-parameteres-model` to compute this value.
       */
      hasParameters: {
        type: Boolean,
        computed:
        '_computeHasParameters(hasQueryParameters,hasUriParameters,allowCustom)'
      },
      // regexp to match query parameters model change
      _queryModelMatcher: {
        type: Object,
        value: function() {
          return /queryModel.(\d+).(name|value|schema\.enabled)/;
        }
      },
      // regexp to match uri parameters model change
      _uriModelMatcher: {
        type: Object,
        value: function() {
          return /uriModel.(\d+).(name|value|schema\.enabled)/;
        }
      },
      /**
       * Map of uri parameters produced by this element.
       */
      uriValue: {
        type: Object,
        notify: true
      },
      /**
       * Map of query parameters produced by this element.
       */
      queryValue: {
        type: Object,
        notify: true
      },
      /**
       * When set, renders add custom parameter button in query parameters
       * form
       */
      allowCustom: Boolean,
      /**
       * Renders forms in "narrow" view
       */
      narrow: Boolean,
      /**
       * Prohibits rendering of the documentation (the icon and the
       * description).
       */
      noDocs: Boolean
    };
  }

  static get observers() {
    return [
      '_queryModelChanged(queryModel.*)',
      '_uriModelChanged(uriModel.*)'
    ];
  }

  constructor() {
    super();
    this._queryParamChangeHandler = this._queryParamChangeHandler.bind(this);
    this._uriParamChangeHandler = this._uriParamChangeHandler.bind(this);
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
    const model = this.queryModel;
    this._appyEventValues(e.detail, model, 'query');
  }

  _uriParamChangeHandler(e) {
    if (e.composedPath()[0] === this || e.defaultPrevented) {
      return;
    }
    const model = this.uriModel;
    this._appyEventValues(e.detail, model, 'uri');
  }
  /**
   * Applies values from the change event to a model.
   *
   * @param {Object} detail Detail event object
   * @param {Array} model Target model
   * @param {String} source `uri` or `query`
   */
  _appyEventValues(detail, model, source) {
    if (!model || !model.length) {
      return;
    }
    const index = model.findIndex((item) => item.name === detail.name);
    if (index === -1) {
      return;
    }
    this.__cancelChangeEvent = true;
    this.set([source + 'Model', index, 'value'], detail.value);
    this.__cancelChangeEvent = false;
    const schema = model[index].schema;
    if (schema && schema.enabled === false) {
      this.set([source + 'Model', index, 'schema', 'enabled'], true);
    }
  }
  /**
   * Computes boolean value if the argument exists and has items.
   *
   * @param {Array} model Current url model.
   * @param {Boolean} allowCustom
   * @return {Boolean}
   */
  _computeHasData(model, allowCustom) {
    return !!(model instanceof Array && model.length) || !!allowCustom;
  }
  /**
   * Computes value for `hasParameters` property.
   *
   * @param {Boolean} qp State of `hasQueryParameters`
   * @param {Boolean} up State of `hasUriParameters`
   * @param {Boolean} allowCustom
   * @return {Boolean} True if any of the arguments is true
   */
  _computeHasParameters(qp, up, allowCustom) {
    return !!(qp || up) || !!allowCustom;
  }

  // Overidden from Polymer.IronValidatableBehavior. Will set the `invalid`
  // attribute automatically, which should be used for styling.
  _getValidity() {
    let validUri = true;
    let validUrl = true;
    if (this.hasUriParameters) {
      const uriForm = this.shadowRoot.querySelector('#uriParametersForm');
      validUri = uriForm ? uriForm.validate() : true;
    }
    if (this.hasQueryParameters) {
      const urlForm = this.shadowRoot.querySelector('#queryParametersForm');
      validUrl = urlForm ? urlForm.validate() : true;
    }
    return validUri && validUrl;
  }
  /**
   * Handler for query model change in path.
   * Calls `_modelChanged()` function with `type` set to `query`
   *
   * @param {Object} record
   */
  _queryModelChanged(record) {
    this._modelChanged('query', record);
  }
  /**
   * Handler for query model change in path.
   * Calls `_modelChanged()` function with `type` set to `uri`
   *
   * @param {Object} record
   */
  _uriModelChanged(record) {
    this._modelChanged('uri', record);
  }
  /**
   * Handles model path change.
   * Informs listeners about the change and produces parameters output.
   *
   * @param {String} type Data model type. `query` or `uri`
   * @param {Object} record Model change record.
   */
  _modelChanged(type, record) {
    if (!record || !record.path) {
      return;
    }
    if (record.path === 'uriModel' || record.path === 'queryModel') {
      this._renotifyModelChange(type);
      this._updateModelValue(type);
    } else if (record.path === 'queryModel.splices') {
      const splices = record.value.indexSplices;
      if (!splices || !splices[0]) {
        return;
      }
      if (splices[0].removed && splices[0].removed.length) {
        this._syncValues(true);
        this._notifyChange('query', splices[0].removed[0], true);
      }
    } else {
      const re = type === 'uri' ? this._uriModelMatcher :
        this._queryModelMatcher;
      const matches = record.path.match(re);
      if (!matches) {
        return;
      }
      const item = this.get([type + 'Model', Number(matches[1])]);
      this._notifyChange(type, item);
      if (record.path.indexOf('name') !== -1) {
        this._syncValues();
      }
      this._updateValue(type, item);
    }
    afterNextRender(this, () => {
      this.validate();
    });
  }
  /**
   * Sends change notification when entire model change.
   *
   * @param {String} type Data model type. `query` or `uri`
   */
  _renotifyModelChange(type) {
    const model = type === 'uri' ? this.uriModel : this.queryModel;
    if (!model || !model.length) {
      return;
    }
    model.forEach((item) => this._notifyChange(type, item));
  }
  /**
   * Notifies about paramter change.
   *
   * @param {String} type Data model type. `query` or `uri`
   * @param {Object} model Model item.
   * @param {Boolean} removed
   */
  _notifyChange(type, model, removed) {
    if (this.__cancelChangeEvent) {
      return;
    }
    let enabled = model.schema && model.schema.enabled;
    if (typeof enabled !== 'boolean') {
      enabled = true;
    }
    const detail = {
      name: model.name
    };
    if (removed) {
      detail.removed = true;
    } else {
      detail.value = model.value;
      detail.enabled = enabled;
    }
    const ev = new CustomEvent(type + '-parameter-changed', {
      detail: detail,
      cancelable: true,
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(ev);
  }
  /**
   * Sunchronizes `queryValues` with current model.
   * It is nescesary when model name property change to detect this change.
   *
   * @param {Boolean} forceReset
   */
  _syncValues(forceReset) {
    const model = this.queryModel;
    const values = this.queryValue;
    if (!model || !values) {
      return;
    }
    Object.keys(values).forEach((key) => {
      const index = model.findIndex((item) => item.name === key);
      if (index === -1) {
        delete this.queryValue[key];
      }
    });
    if (forceReset) {
      this.queryValue = undefined;
      this.set('queryValue', values);
    }
  }
  /**
   * Update generated value for a model.
   * @param {String} type Data model type. `query` or `uri`
   * @param {Object} item Model item
   */
  _updateValue(type, item) {
    const path = type + 'Value';
    const enabled = item.schema && item.schema.enabled;
    const result = this[path] || {};
    this[path] = undefined;
    if (enabled === false) {
      delete result[item.name];
    } else {
      result[item.name] = item.value;
      // this.set([path, item.name].join('.'), item.value);
    }
    this.set(path, result);
  }
  /**
   * Updates value for entire model.
   * @param {String} type Data model type. `query` or `uri`
   */
  _updateModelValue(type) {
    const path = type + 'Value';
    const model = type === 'uri' ? this.uriModel : this.queryModel;
    if (!model || !model.length) {
      this.set(path, undefined);
      return;
    }
    const result = {};
    model.forEach((item) => {
      let enabled = item.schema && item.schema.enabled;
      if (enabled === false) {
        return;
      }
      result[item.name] = item.value;
    });
    this.set(path, result);
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

window.customElements.define(ApiUrlParamsEditor.is, ApiUrlParamsEditor);
