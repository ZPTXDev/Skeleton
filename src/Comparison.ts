export enum Comparison {
    /** Equal (equivalent to ===) */
    Equal = '==',
    /** Not equal (equivalent to !==) */
    NotEqual = '!=',
    /** Greater than (equivalent to >) - only applicable to NumberConfigItemRequireCondition */
    GreaterThan = '>',
    /** Less than (equivalent to <) - only applicable to NumberConfigItemRequireCondition */
    LessThan = '<',
    /** Greater than or equal to (equivalent to >=) - only applicable to NumberConfigItemRequireCondition */
    GreaterThanOrEqual = '>=',
    /** Less than or equal to (equivalent to <=) - only applicable to NumberConfigItemRequireCondition */
    LessThanOrEqual = '<=',
}
