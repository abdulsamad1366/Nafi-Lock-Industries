import { UserAuthPayload } from "../middleware/user-auth.middleware";
/**
 * Check if the authenticated requester is an APPROVED distributor
 */
export declare function isUserApprovedDistributor(user?: UserAuthPayload): Promise<boolean>;
/**
 * Serialize a single product: strip dealerPrice and minOrderQty unless requester is approved distributor
 */
export declare function serializeProduct(product: any, isApprovedDistributor: boolean): any;
/**
 * Serialize an array of products
 */
export declare function serializeProducts(products: any[], isApprovedDistributor: boolean): any[];
//# sourceMappingURL=product-serializer.d.ts.map