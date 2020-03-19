var net = require("net");
var client = net.Socket();

client.connect(8210, '192.168.137.128',function () {
    var flag;//判断用户注册还是登录，１为注册(SIGN)，２为登录(LOGIN)
    var name;//用户账号
    var pwd;//用户密码
    console.log('\n\n=======欢迎使用聊天室软件=======\n');
    console.log('首次登录，请按[1]注册账号\n');
    console.log('已有账号，请按[2]进行登录\n');
    console.log('================================');

    process.stdin.on('readable', () => {

        let chunk;
        while ((chunk=process.stdin.read())!== null) {
            let input=chunk.toString().trim();

            //判断用户登录还是注册
            if(flag==undefined){

                if(input=='1'||input=='2'){
                    flag=input;

                    switch (parseInt(flag)) {
                        //注册
                        case 1:
                            console.log('----------用户注册----------\n');
                            console.log('请输入账号:');
                            continue;
                        //登录
                        case 2:
                            console.log('----------用户登录----------\n');
                            console.log('请输入账号:');
                            continue;
                    }
                }else{
                    console.log('#####<输入错误，请重新输入>#####\n');
                    console.log('\n\n=======欢迎使用聊天室软件=======\n');
                    console.log('首次使用，请按[1]注册账号\n');
                    console.log('已有账号，请按[2]进行登录\n');
                    console.log('================================');
                    continue;
                }
            //获取账户名
            }else if(name==undefined){
                name=input;
                console.log('请输入密码:');

            //获取密码，发送账号密码给后端
            }else if((name!==undefined)&&(pwd==undefined)){
                pwd=input;
                //发送服务器sign/login+name+pwd
                client.write((flag==1?'SIGN':'LOGIN')+' '+name+' '+pwd);

            }else if((name!=undefined)&&(pwd!=undefined)){
                //私聊
                if(input.startsWith('@')){
                    client.write('@'+' '+input.slice(1).trim());
                }else{
                    //下线，触发process.stdin.end事件
                    if(input=='quit'){
                        client.write('quit ');
                        process.stdin.emit('end');
                        return;
                    }else{
                        //群聊
                        client.write('ALL '+input);
                    }
                }
            }
        }
    });
    //断开stdin事件
    process.stdin.on('end',()=>{});

    //接收服务器返回的信息
    client.on("data", function (data) {
        let status=parseInt(data.toString().split(' ')[0]);
        let message=data.toString().slice(4);
        switch (status) {

            case 200://注册成功
                console.log('\n#####<注册成功，请登录>######');
                console.log('----------账户登录----------');
                console.log('请输入账号:');
                flag=2;
                name=undefined;
                pwd=undefined;
                break;
                
            case 201://登录成功
                console.log(message);
                break;
                
            case 202://普通聊天
                console.log(message);
                break;
                
            case 402://注册格式不对
                console.log('#####<账号密码不能为空，请重新注册>#####\n');
                console.log('请输入账号:');
                name=undefined;
                pwd=undefined;
                break;
                
            case 403://注册账号已存在
                console.log('#####<账号已存在，请重新注册>#####\n');
                console.log('请输入账号:');
                name=undefined;
                pwd=undefined;
                break;
                
            case 404://注册失败
                console.log('#####<账号失败，请重新注册>#####\n');
                console.log('请输入账号:');
                name=undefined;
                pwd=undefined;
                break;

            case 405://登录失败
                console.log('#####<登录失败，请重新登录>#####');
                console.log('请输入账号:');
                name=undefined;
                pwd=undefined;
                break;

            case 406://服务器返回下线通知
                client.emit('end',()=>{
                });
                break;

            case 407://账号重复登录
                console.log('#####<账号已登录，请换个账号重新登录！>#####');
                console.log('请输入账号:');
                name=undefined;
                pwd=undefined;
                break;

            }
    });
});

client.on('end', () => {
    console.log('您已下线');
});
