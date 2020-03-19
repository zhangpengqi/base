const net = require('net');
const fs=require('fs');

const server = net.createServer((client) => {

    let arr=[];//接收客户请求信息
    let method;//get 或post方法
    let path;//相对路径
    let ip;//ip地址
    let post;//端口号
    let url;
    let username;//账号
    let password;//密码

    client.on("data", (request) => {
        //将请求信息拆分，分离出请求方式、IP、端口号和相对路径
        arr=request.toString().split('\r\n');
        method=arr[0].split(' ')[0];
        path = arr[0].split(' ')[1].slice(1);
        ip=arr[1].split(' ')[1].split(':')[0];
        if((ip=="localhost")||(ip=="127.0.0.1")){
            ip="localhost";
        }
        post=arr[1].split(' ')[1].split(':')[1];
        url='http://'+ip+':'+post+'/'+path;
        //get方法
        if(method=='GET'){
            //管理员界面
            if(url=='http://localhost:8001/admin'){
                let id=arr[(arr.length-3)].split(' ')[1].split('=')[0];
                let i=arr[(arr.length-3)].split(' ')[1].split('=')[1];
                let data='';
                //判断客户端是否有cookie
                if(id=='SESSID'){
                    let readerStream=fs.createReadStream(i+'.txt');
                    readerStream.setEncoding('UTF-8');
                    //读取本地文件
                    readerStream.on('data',function(chunk){
                        data +=chunk;
                    });
                    readerStream.on('end',function(){
                        if(data==''){
                            client.write("HTTP/1.1 302 Found\n");
                            client.write('location:http://localhost:8001/login\n');
                            client.end();
                        }else{
                            client.write('HTTP/1.1 200 OK\n');
                            client.write('Content-type: text/html;charset=utf-8\n\n');
                            client.write('<h2>'+data+'</h2>\n');
                            client.end();
                        }
                    });
                    readerStream.on('error',function(){
                        client.write("HTTP/1.1 302 Found\n");
                        client.write('location:http://localhost:8001/login\n');
                        client.end();
                    });
                }else{
                    //没有cookie，自动跳转登录界面
                    client.write("HTTP/1.1 302 Found\n");
                    client.write('location:http://localhost:8001/login\n');
                    client.end();
                }
            }
            //登录界面
            if(url=='http://localhost:8001/login'){
                client.write("HTTP/1.1 200 OK\n");
                client.write("Content-Type: text/html;charset=utf-8\n\n");
                client.write('<h1>登录界面</h1>');
                client.write('<form action="" method="POST" >');
                client.write('<input placeholder="请输入账号" type ="text" name="username"></br>');
                client.write('<input placeholder="请输入密码" type="password" name="password"></br>');
                client.write('<input type="submit" value="提交">');
                client.write('</form>');
                client.end();
            }

            //管理员后台
            if(url=='http://localhost:8001/'){
                client.write("HTTP/1.1 200 OK\n");
                client.write("Content-Type: text/html;charset=utf-8\n\n");
                client.write('<h1>welcome</h1><a href="/admin">进入管理员后台</a>\n');
                client.end();
            }
        }

        //post方法
        if(method=='POST'){
            username=arr[(arr.length-1)].split('=')[1].split('&')[0];
            password=arr[(arr.length-1)].split('=')[2];
            //登录成功
            if(username=='admin'&&password=='123456'){
                let num;
                if((num=Math.ceil(Math.random()*1000000))>100000)
                client.write("HTTP/1.1 302 Found\n");
                //写入文件
                let writestream=fs.createWriteStream(num+'.txt');
                writestream.write(username,'utf-8');
                writestream.end();
                //Set-cookie
                client.write('Set-cookie: SESSID='+num+'\n');
                client.write('location:http://localhost:8001/admin\n');
                client.end();
            }else{
                //登录失败
                client.write('HTTP/1.1 302 Found\n');
                client.write('location:http://localhost:8001/login\n');
                client.end();
            }
        }
    });
});
server.listen(8001, () => {
    console.log('server started');
});