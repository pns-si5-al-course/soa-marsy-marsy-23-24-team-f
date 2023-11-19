export const SUBSCRIBER_FN_REF_MAP = new Map();
export const SUBSCRIBER_FIXED_FN_REF_MAP = new Map();
export const SUBSCRIBER_OBJ_REF_MAP = new Map();

export function SubscribeTo(topic) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = target[propertyKey];
    SUBSCRIBER_FN_REF_MAP.set(topic, originalMethod);
    SUBSCRIBER_OBJ_REF_MAP.set(topic, target);
    return descriptor;
  };
}


// export function SubscribeTo(topic) {
//   return function (target: any, propertyKey: string) {
//     const originalMethod = target[propertyKey];
//     SUBSCRIBER_FN_REF_MAP.set(topic, originalMethod);
//     SUBSCRIBER_OBJ_REF_MAP.set(topic, target);

//     // Définir une méthode getter pour la propriété
//     Object.defineProperty(target, propertyKey, {
//       get() {
//         return function (...args: any[]) {
//           return originalMethod.apply(this, args);
//         };
//       },
//     });
//   };
// }








export function SubscribeToFixedGroup(topic) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = target[propertyKey];
    SUBSCRIBER_FIXED_FN_REF_MAP.set(topic, originalMethod);
    SUBSCRIBER_OBJ_REF_MAP.set(topic, target);
    return descriptor;
  };
}
