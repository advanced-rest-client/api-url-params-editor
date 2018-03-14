/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-url-params-editor.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/elements/dom-if.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="../iron-validatable-behavior/iron-validatable-behavior.d.ts" />
/// <reference path="../paper-checkbox/paper-checkbox.d.ts" />
/// <reference path="api-url-params-form.d.ts" />

declare namespace ApiElements {

  /**
   * `api-url-params-editor`
   * An element to render query / uri parameters form from AMF schema
   *
   * This element is to replace `raml-request-parameters-editor` which can
   * only work with RAML parser custom data model.
   *
   * Use `api-url-params-editor` to generate pre-populated form of query and
   * uri paramters for an API endpoint. It accepts [AMF](https://github.com/mulesoft/amf)
   * json/ld model for an API to render the view.
   *
   * This element works together with `api-url-editor`. Both elements uses
   * the same view data model generated by
   * [api-view-model-transformer](https://github.com/advanced-rest-client/api-view-model-transformer)
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
   */
  class ApiUrlParamsEditor extends
    Polymer.IronValidatableBehavior(
    Polymer.Element) {

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
     * Computes boolean value if the argument exists and has items.
     *
     * @param model Current url model.
     */
    _computeHasData(model: any[]|null): Boolean|null;

    /**
     * Computes value for `hasParameters` property.
     *
     * @param qp State of `hasQueryParameters`
     * @param up State of `hasUriParameters`
     * @returns True if any of the arguments is true
     */
    _computeHasParameters(qp: Boolean|null, up: Boolean|null): Boolean|null;

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
    _notifyChange(type: String|null, model: object|null): void;

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

interface HTMLElementTagNameMap {
  "api-url-params-editor": ApiElements.ApiUrlParamsEditor;
}
