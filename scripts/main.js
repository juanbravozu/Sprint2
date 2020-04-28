window.addEventListener('load', () => {

    getData();

    async function getData() {
        const response = await fetch('../resources/sprint2_data.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        const dataObjectList = [];

        const select = document.getElementById('select');
        const result = document.querySelector('.images');

        const ageRange = document.getElementById('age');
        const heightRange = document.getElementById('height');
        const weightRange = document.getElementById('weight');
        const petsRange = document.getElementById('pets');

        ageRange.addEventListener('input', updateComparison);
        heightRange.addEventListener('input', updateComparison);
        weightRange.addEventListener('input', updateComparison);
        petsRange.addEventListener('input', updateComparison);

        rows.forEach((e) => {
            const values = e.split(',');
            values[3] = parseInt(values[3]);

            const dataObject = {
                name: values[0],
                age: values[1],
                weight: values[2],
                height: values[3],
                pets: values[4],
            }

            const option = document.createElement('option');
            option.setAttribute('value', values[0]);
            option.innerHTML = values[0];

            const image = document.createElement('img');
            image.setAttribute('src', './resources/img/'+dataObject.name+'.jpg');
            image.dataset.value = dataObject.name;
            
            result.appendChild(image);

            select.appendChild(option);
            dataObjectList.push(dataObject);
        }); 

        updateComparison();
        
        select.addEventListener('change', updateComparison);

        function updateComparison() {
            let selected;
            dataObjectList.forEach((e) => {
                if(select.value == e.name) selected = e;
            });

            let results = [];
            dataObjectList.forEach((e) => {
                const productoPunto = ((selected.age * ageRange.value) * (e.age * ageRange.value)) + ((selected.weight * weightRange.value) * (e.weight * weightRange.value)) + ((selected.height * heightRange.value) * (e.height * heightRange.value)) + ((selected.pets * petsRange.value) * (e.pets * petsRange.value));
                const magA = Math.sqrt(((selected.age * ageRange.value) * (selected.age * ageRange.value)) + ((selected.weight * weightRange.value) * (selected.weight * weightRange.value)) + ((selected.height * heightRange.value) * (selected.height * heightRange.value)) + ((selected.pets * petsRange.value) * (selected.pets * petsRange.value)));
                const magB = Math.sqrt(((e.age * ageRange.value) * (e.age * ageRange.value)) + ((e.weight * weightRange.value) * (e.weight * weightRange.value)) + ((e.height * heightRange.value) * (e.height * heightRange.value)) + ((e.pets * petsRange.value) * (e.pets * petsRange.value)));
    
                let resultValue;

                if(magA > 0 && magB > 0) {
                    resultValue = productoPunto / (magA * magB);
                } else {
                    resultValue = 0;
                }

                console.log(e.name, productoPunto, magA, magB, resultValue);

                results.push({
                    name: e.name,
                    result: resultValue,
                });
            });

            results.sort(orderResults);
            
            const images = document.querySelectorAll('img');

            results.forEach((e, index) => {
                let selectedImg;
                images.forEach((img) => {
                    if(img.dataset.value == e.name) selectedImg = img;
                });
                selectedImg.style.left = (3 + (51 * index)) + 'px';

                selectedImg.style.top = (195 - (e.result * 195)) + 'px';
            });
        }

        function orderResults(a, b) {
            if(a.result > b.result) {
                return -1;
            } else if(a.result < b.result) {
                return 1;
            } else {
                return 0;
            }
        }


        /*const productoPunto = (person1.age * person2.age) + (person1.weight * person2.weight) + (person1.height * person2.height) + (person1.pets * person2.pets);
        const magA = Math.sqrt((person1.age*person1.age) + (person1.weight*person1.weight) + (person1.height*person1.height) + (person1.pets*person1.pets));
        const magB = Math.sqrt((person2.age*person2.age) + (person2.weight*person2.weight) + (person2.height*person2.height) + (person2.pets*person2.pets));
    
        const resultValue = productoPunto / (magA * magB);
        console.log(resultValue);

        result.innerHTML = resultValue;*/
    }
});