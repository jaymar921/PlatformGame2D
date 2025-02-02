export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const convertSingleArrayMapTo2DArray = (arr = [], dimension = { row: 0, column: 0}, value = undefined) => {
    const newArr = [];

    let i = 0;

    for(let r = 0; r < dimension.row; r++){
        const colArr = [];

        for(let c = 0; c < dimension.column; c++){
            let val = arr[i++];

            if(val !== null || val !== undefined){
                if(value !== undefined && val !== 0) val = value;
                colArr.push(val);
            }

        }

        newArr.push(colArr);
    }

    return newArr;
}