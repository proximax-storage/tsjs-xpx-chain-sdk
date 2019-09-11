"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The EmptyAlias structure describes empty aliases (type:0)
 *
 * @since 0.10.2
 */
class EmptyAlias {
    /**
     * Create EmptyAlias object
     *
     * @param type
     * @param content
     */
    constructor() {
        this.type = 0;
    }
    /**
     * Compares EmptyAlias for equality.
     *
     * @return boolean
     */
    equals(alias) {
        return alias instanceof EmptyAlias || alias.type === 0;
    }
}
exports.EmptyAlias = EmptyAlias;
//# sourceMappingURL=EmptyAlias.js.map