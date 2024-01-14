const data = [
  {
    "nama": "Budi",
    "age": 30
  },
  {
    "nama": "Tejo",
    "age": 17
  },
  {
    "nama": "Bejo",
    "age": 23
  },
  {
      "nama": "Harjo",
      "age": 20
    }
]

let dataSort = []

// Urutkan data json tersebut dari yang paling muda hingga yang paling tua dengan menggunakan for loop

for (i = 0; i < data.length; i++) {
  if (data[i+1] !== undefined) {
    if (data[i].age < data[i+1].age) {
      dataSort[i] = data[i]
    } else {
      dataSort[i] = data[i+1]
    }
  }
}
console.log(dataSort);