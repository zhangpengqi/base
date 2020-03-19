var net = require("net");
var client = net.Socket();

client.connect(8210, '127.0.0.1',function () {
    var name;
    console.log('请输入名字\n');
    process.stdin.on('readable', () => {
        let chunk;
        while ((chunk=process.stdin.read())!== null) {
            let input =chunk.toString().trim();
            //获取用户名字
            if(name==undefined){
                name=input;
                client.write("username:"+name);
            }else{
                //发送普通信息
                client.write(input);
            }
        }
    });
    //接收服务器返回的信息
    client.on("data", function (data) {
        console.log(  data.toString() );
    })
})
    