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
    // const get = (requestParams) => {


    // }

    /**
     * Defines the function that is executed when a PUT request is sent to a RESTlet.
     * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
     *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
     *     the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
     *     Object when request Content-Type is 'application/json' or 'application/xml'
     * @since 2015.2
     */
    // const put = (requestBody) => {

    // }

    /**
     * Defines the function that is executed when a POST request is sent to a RESTlet.
     * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
     *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
     *     the body must be a valid JSON)
     * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
     *     Object when request Content-Type is 'application/json' or 'application/xml'
     * @since 2015.2
     */

    //         The script should receive the details with required action 
    // If the customer already exists(use email address as a unique identifier), update the details of the existing customer.  
    // If the customer does not exist, create a new customer with received details. 
    // For Deletion request(use email address as unique identifier), inactivate the customer in NetSuite

    const post = (requestBody) => {
      try {

      const customerData = JSON.parse(requestBody).requestBody;
      const email = customerData.email;

      if (!email) {
        return { status: 'error', message: 'Email is required to identify customer' };
      }

      // Search 
      const customerSearch = search.create({
        type: 'customer',
        filters: [['email', 'is', email]],
        columns: ['internalid']
      });

      const searchResult = customerSearch.run().getRange({ start: 0, end: 1 });

      if (searchResult.length > 0) {
        // update record
        const customerId = searchResult[0].getValue('internalid');
        const customerRecord = record.load({
          type: record.Type.CUSTOMER,
          id: customerId,
          isDynamic: true
        });

        customerRecord.setValue({ fieldId: 'firstname', value: customerData.firstName });
        customerRecord.setValue({ fieldId: 'lastname', value: customerData.lastName });
        customerRecord.setValue({ fieldId: 'phone', value: customerData.phone });
        customerRecord.setValue({ fieldId: 'companyname', value: customerData.companyName });
       

        customerRecord.save();
        return { status: 'success', message: 'Customer updated successfully' };
      } else {
        // create new record
        try {
           const customer = record.create({
                type: record.Type.CUSTOMER,
                isDynamic: true
            });
            customer.setValue({
                fieldId: 'companyname',
                value: 'company Abc'
            });
            customer.setValue({
                fieldId: 'subsidiary',
                value: 22
            });
            const customerId = customer.save({
                ignoreMandatoryFields: true
            });
            log.audit('Customer Created', `Customer ID: ${customerId}`);
            return {
                status: 'success',
                message: 'Customer record created successfully',
                customerId: customerId
            };
          
        } catch (e) {
          return { status: 'error', message: e.message };
        }
      }
    } catch (e) {
      return { status: 'error', message: e.message };
    }
    };
    /**
     * Defines the function that is executed when a DELETE request is sent to a RESTlet.
     * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
     *     content types)
     * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
     *     Object when request Content-Type is 'application/json' or 'application/xml'
     * @since 2015.2
    //  */
    // const doDelete = (requestParams) => {
      function deleteCustomer(data) {
                try {
                    const email = JSON.parse(requestBody).email;
                    



                    var customerSearchObj = search.create({
                        type: "customer",
                        filters:
                            [
                                ["email", "is", requestBody.email]
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
            return deleteCustomer(requestBody);



    

    return { post }
  })







