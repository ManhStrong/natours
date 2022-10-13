class APIFeatures{
    constructor(query,queryString)
    {
    this.query = query;
    this.queryString = queryString
    }

    filter() {
        const queryObject = {...this.queryString};
        // console.log(queryObject);
        const executeField = ['page','sort','limit','fields'].forEach(el=> delete queryObject[el]);
         //console.log(req.query,queryObject);
         //Advanced filtering
         let queryStr = JSON.stringify(queryObject);
         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);
         //console.log(JSON.parse(queryStr));
         this.query =  this.query.find(JSON.parse(queryStr));//return query
         return this;
    }

    sort() {
        console.log(typeof this.queryString.sort);
         if(this.queryString.sort)
         {
            const result = this.queryString.sort.split(',').join(' ');
            console.log(result);
            this.query= this.query.sort(result);
         }
         else {
            this.query = this.query.sort('-createdAt')
         }
         return this;
    }

    limitField()
    {
        if(this.queryString.fields)
         {
            console.log(this.queryString.fields);
            const fields = this.queryString.fields.split(',').join(' ');
            console.log(fields);
            this.query = this.query.select(fields);
         }
         else {
            this.query =this.query.select('-__v');
         }
         return this;
    }

    paginate()
    {
        const page = this.queryString.page*1 || 1;
        const limit = this.queryString.limit*1 || 100;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
module.exports = APIFeatures;