import { ChronoUnit, LocalDateTime } from 'js-joda';
/**
 * The deadline of the transaction. The deadline is given as the number of seconds elapsed since the creation of the nemesis block.
 * If a transaction does not get included in a block before the deadline is reached, it is deleted.
 */
export declare class Deadline {
    /**
     * @type {number}
     */
    static timestampNemesisBlock: number;
    /**
     * Deadline value
     */
    value: LocalDateTime;
    /**
     * Create deadline model
     * @param deadline
     * @param chronoUnit
     * @returns {Deadline}
     */
    static create(deadline?: number, chronoUnit?: ChronoUnit): Deadline;
    /**
     * @param deadline
     */
    private constructor();
}
