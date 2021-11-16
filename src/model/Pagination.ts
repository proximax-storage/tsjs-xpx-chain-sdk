
export class Pagination{

    /**
     * @param totalEntries
     * @param pageNumber
     * @param pageSize
     * @param totalPages
     */
     constructor(
         public readonly totalEntries: number, 
         public readonly pageNumber: number, 
         public readonly pageSize: number, 
         public readonly totalPages: number) {   
    }
}