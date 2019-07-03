"use strict";
/*
 * Copyright 2018 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @since 0.11.3
 */
var Order;
(function (Order) {
    Order["ASC"] = "id";
    Order["DESC"] = "-id";
})(Order = exports.Order || (exports.Order = {}));
/**
 * The query params structure describes pagination params for requests.
 *
 * @since 1.0
 */
class QueryParams {
    /**
     * Constructor
     * @param pageSize
     * @param id
     */
    constructor(
    /**
     * Page size between 10 and 100, otherwise 10
     */
    pageSize, 
    /**
     * Id after which we want objects to be returned
     */
    id, 
    /**
     * Order of transactions.
     * DESC. Newer to older.
     * ASC. Older to newer.
     */
    order = Order.DESC) {
        this.pageSize = pageSize;
        this.id = id;
        this.order = order;
        this.pageSize = (pageSize >= 10 && pageSize <= 100) ? pageSize : 10;
        this.id = id;
    }
}
exports.QueryParams = QueryParams;
//# sourceMappingURL=QueryParams.js.map