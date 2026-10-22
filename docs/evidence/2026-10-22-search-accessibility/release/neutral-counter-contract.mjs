// Qualification harness only. Refuse counters whose source or shape differs.
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);
const record=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const count=value=>Number.isSafeInteger(value)&&value>=0;
export function acceptCounters(raw,baseline,owners){
 const accepted={},rejections=[];
 if(!record(raw))return {accepted,rejections:['counter_shape']};
 for(const [file,value]of Object.entries(raw)){
  const expected=baseline[file];
  if(!expected||!owners[file]){rejections.push('unknown_owner');continue;}
  if(!record(value)||value.path!==file||['statementMap','fnMap','branchMap'].some(key=>!same(value[key],expected[key]))){rejections.push('source_map_mismatch');continue;}
  if(['s','f','b'].some(key=>!record(value[key])||!same(Object.keys(value[key]).sort(),Object.keys(expected[key]).sort()))){rejections.push('counter_keys');continue;}
  if(['s','f'].some(key=>Object.values(value[key]).some(n=>!count(n)))||Object.entries(value.b).some(([key,values])=>!Array.isArray(values)||values.length!==expected.b[key].length||values.some(n=>!count(n)))){rejections.push('counter_value');continue;}
  accepted[file]=value;
 }
 return {accepted,rejections};
}
