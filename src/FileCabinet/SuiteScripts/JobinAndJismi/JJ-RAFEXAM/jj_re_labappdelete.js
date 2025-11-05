/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/error', 'N/search'],
    function (record, error, search) {

        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */

        // For Deletion request (use email address as unique identifier), inactivate the customer in NetSuite 
        const doDelete = (requestParams) => {
            function deleteCustomer(data) {
                try {
                    const email = JSON.parse(requestParams).email;
                    



                    var customerSearchObj = search.create({
                        type: "customer",
                        filters:
                            [
                                ["email", "is", requestParams.email]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "internalid", label: "Internal ID" })
                            ]
                    });
                    var searchResultCount = customerSearchObj.runPaged().count;
                    if (searchResultCount > 0) {
                        customerSearchObj.run().each(function (result) {
                            var customerId = result.getValue({ name: 'internalid' });
                            var customerRecord = record.load({
                                type: record.Type.CUSTOMER,
                                id: customerId,
                                isDynamic: true,
                            });
                            customerRecord.setValue({ fieldId: 'isinactive', value: true });
                            var customerUpdateId = customerRecord.save();
                            return true;
                        });
                        return { status: 'success', message: 'Customer inactivated successfully' };
                    } else {
                        return { status: 'error', message: 'Customer not found' };
                    }
                } catch (e) {
                    return { status: 'error', message: e.message };
                }

            }
            return deleteCustomer(requestParams);


        }

        return { get, put, post, delete: doDelete }

    });


