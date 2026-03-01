type AnyObject = { [key: string]: any };

/**
 * 再帰的にオブジェクトを探索して、値が配列のものを収集する関数
 * @param obj - 対象のオブジェクト
 * @returns 配列を結合した一つの配列
 */
function collectArrays(obj: AnyObject): any[] {
  const result: any[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (Array.isArray(value)) {
        result.push(...value);
      } else if (typeof value === 'object' && value !== null) {
        result.push(...collectArrays(value));
      }
    }
  }

  return result;
}

export default collectArrays;
