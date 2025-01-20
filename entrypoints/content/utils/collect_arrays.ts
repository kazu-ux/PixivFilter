type AnyObject = { [key: string]: any };

/**
 * 再帰的にオブジェクトを探索して、値が配列のものを収集する関数
 * @param obj - 対象のオブジェクト
 * @returns 配列を結合した一つの配列
 */
function collectArrays(obj: AnyObject): any[] {
  let result: any[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (Array.isArray(value)) {
        // 値が配列の場合、結果に追加
        result = result.concat(value);
      } else if (typeof value === 'object' && value !== null) {
        // 値がオブジェクトの場合、再帰的に探索
        result = result.concat(collectArrays(value));
      }
    }
  }

  return result;
}

export default collectArrays;
