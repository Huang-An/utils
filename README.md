```bash
import utils from 'utils'
const util = new utils({
    data(){
        retrun{
            title: "0"
        }
    },
    watch:{
        title(newVal, oldVal){
            console.log(newVal)
            console.log(oldVal)
        }
    }
})
util.title = "1"
```

```bash
<script src="../../dist/utils.js"></script>
<script>
    var util = new utils({
        data() {
            return {
                title: "10"
            }
        },
        watch: {
            title(newVal, oldVal) {
                console.log(newVal);
                console.log(oldVal);
            },
        },
    })
    util.title = "101"
</script>
```