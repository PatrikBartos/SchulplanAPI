class APIFeatures {
  constructor(query, queryString) {
    this.query = query; //Das Mongoose-Query-Objekt, das du baust (Tour.find()), aber noch nicht ausgeführt hast. Es enthält alle Infos zur Abfrage.
    // .sort(), .select(), .limit()	Methoden, die du auf this.query anwendest, um die Abfrage zu verfeinern.
    // wird am ende mit return await this.query ausgefuehrt
    this.queryString = queryString; // 	Das rohe Query-Objekt aus der URL (req.query)
    // console.log(queryString);
    // console.log(this.query);
  }

  filter() {
    const queryObj = Object.fromEntries(
      Object.entries(this.queryString).filter(
        ([key]) => !['page', 'sort', 'limit', 'fields'].includes(key), // Ist key NICHT in der Liste ['page', 'sort', 'limit', 'fields'] enthalten?
      ),
    );
    // Falls key nicht in dieser Liste ist, bleibt das Paar erhalten (true).
    // Falls key in der Liste ist, wird das Paar gefiltert (false).

    // console.log(queryObj); // == z.b { price: { lt: '900' } }
    // console.log(JSON.stringify(queryObj)); // == z.b {"price":{"lt":"900"}}

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    // console.log(queryStr); // == z.b {"price":{"$lt":"900"}}

    // gte = greater than or equal → größer oder gleich (≥)
    // gt = greater than → größer als (>)
    // lte = less than or equal → kleiner oder gleich (≤)
    // lt = less than → kleiner als (<)

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // umwandeln in ein mongoose Gueltiges Format
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('_id');
    }
    return this;
  }

  fieldLimiting() {
    if (this.queryString.fields) {
      // console.log(this.queryString); // = { fields: 'name,duration,difficulty,price' } 1)
      // this.queryString.fields = "name,price,duration" 2)
      const fields = this.queryString.fields.split(',').join(' '); // = "name price duration" 3)
      this.query = this.query.select(fields); // mit select die Felder auswaehlen, die angezeigt werden sollen
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  async pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100; // number of results on each page
    const skip = (page - 1) * limit;
    // ?page=3&limit=10 1-10 are on page 1, 11-20 are on page 2, 21-30 are on page 3...
    // if we requesting page number 3, all results are going to start at page number 21
    // so we want to skip 20 pages before
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  async exec() {
    return await this.query;
  }
}

export default APIFeatures;
