/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-url-params-editor.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

declare namespace ApiElements {

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
   */
  class ApiUrlParamsEditor extends
    EventsTargetMixin(
    Object) {

    /**
     * Computed by `api-view-model-transformer` qury parameters model.
     *
     * Note, this element won't accept AMF data.
     */
    queryModel: any[]|null|undefined;

    /**
     * Computed value if the `queryParameters` are set.
     * Use `raml-request-parameteres-model` to compute this value.
     */
    readonly hasQueryParameters: boolean|null|undefined;

    /**
     * Computed by `api-view-model-transformer` URI parameters model.
     *
     * Note, this element won't accept AMF data.
     */
    uriModel: any[]|null|undefined;

    /**
     * Computed value if the `uriParameters` are set.
     * Use `raml-request-parameteres-model` to compute this value.
     */
    readonly hasUriParameters: boolean|null|undefined;

    /**
     * Computed value if `uriParameters` or `queryParameters` are set.
     * Use `raml-request-parameteres-model` to compute this value.
     */
    readonly hasParameters: boolean|null|undefined;

    /**
     * regexp to match query parameters model change
     */
    _queryModelMatcher: object|null|undefined;

    /**
     * regexp to match uri parameters model change
     */
    _uriModelMatcher: object|null|undefined;

    /**
     * Map of uri parameters produced by this element.
     */
    uriValue: object|null|undefined;

    /**
     * Map of query parameters produced by this element.
     */
    queryValue: object|null|undefined;

    /**
     * When set, renders add custom parameter button in query parameters
     * form
     */
    allowCustom: boolean|null|undefined;

    /**
     * Renders forms in "narrow" view
     */
    narrow: boolean|null|undefined;

    /**
     * Prohibits rendering of the documentation (the icon and the
     * description).
     */
    noDocs: boolean|null|undefined;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;

    /**
     * Handler for the `query-parameter-changed` custom event.
     * Updates model value from the event
     */
    _queryParamChangeHandler(e: CustomEvent|null): void;
    _uriParamChangeHandler(e: any): void;

    /**
     * Applies values from the change event to a model.
     *
     * @param detail Detail event object
     * @param model Target model
     * @param source `uri` or `query`
     */
    _appyEventValues(detail: object|null, model: any[]|null, source: String|null): void;

    /**
     * Computes boolean value if the argument exists and has items.
     *
     * @param model Current url model.
     */
    _computeHasData(model: any[]|null, allowCustom: Boolean|null): Boolean|null;

    /**
     * Computes value for `hasParameters` property.
     *
     * @param qp State of `hasQueryParameters`
     * @param up State of `hasUriParameters`
     * @returns True if any of the arguments is true
     */
    _computeHasParameters(qp: Boolean|null, up: Boolean|null, allowCustom: Boolean|null): Boolean|null;

    /**
     * attribute automatically, which should be used for styling.
     */
    _getValidity(): any;

    /**
     * Handler for query model change in path.
     * Calls `_modelChanged()` function with `type` set to `query`
     */
    _queryModelChanged(record: object|null): void;

    /**
     * Handler for query model change in path.
     * Calls `_modelChanged()` function with `type` set to `uri`
     */
    _uriModelChanged(record: object|null): void;

    /**
     * Handles model path change.
     * Informs listeners about the change and produces parameters output.
     *
     * @param type Data model type. `query` or `uri`
     * @param record Model change record.
     */
    _modelChanged(type: String|null, record: object|null): void;

    /**
     * Sends change notification when entire model change.
     *
     * @param type Data model type. `query` or `uri`
     */
    _renotifyModelChange(type: String|null): void;

    /**
     * Notifies about paramter change.
     *
     * @param type Data model type. `query` or `uri`
     * @param model Model item.
     */
    _notifyChange(type: String|null, model: object|null, removed: Boolean|null): void;

    /**
     * Sunchronizes `queryValues` with current model.
     * It is nescesary when model name property change to detect this change.
     */
    _syncValues(forceReset: Boolean|null): void;

    /**
     * Update generated value for a model.
     *
     * @param type Data model type. `query` or `uri`
     * @param item Model item
     */
    _updateValue(type: String|null, item: object|null): void;

    /**
     * Updates value for entire model.
     *
     * @param type Data model type. `query` or `uri`
     */
    _updateModelValue(type: String|null): void;
  }
}

declare global {

  interface HTMLElementTagNameMap {
    "api-url-params-editor": ApiElements.ApiUrlParamsEditor;
  }
}

export {};
