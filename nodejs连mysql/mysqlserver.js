var net = require('net')
var mysql  = require('mysql');  
let onlineclients = [];//存放在线人
let sqlBasedata={     
    host     : 'localhost',       
    user     : 'root',              
    password : '123456',       
    port: '3306',                   
    database: 'test' 
};

/**
 * 创建服务器
 */
var server = net.createServer( (sock)=> {
    
    sock.on('data', function(data) {
        (async()=>{
            //接收数据
            let message=data.toString();//用户发来信息，转为String类型
            let start=message.substring(0,message.indexOf(' '));//用户信息，第一个空格前的字符串

            //通过数据首字段，判断是注册、登录、群聊、私聊、退出
            switch (start) {
                
                //注册
                case 'SIGN':{

                    let arr=message.split(' ');
                    //长度不为３，不符合注册格式:sign 账号 密码，注册失败，提示重新注册
                    if(arr.length!=3){
                        sock.write('402 注册账号、密码不能为空');
                        break;
                    }
                    //长度为3,继续执行
                    let name=arr[1];
                    let password=arr[2];
                    //连接数据库,按用户名先查找
                    let selectResult;//数据库查询结果
                    try {
                        selectResult=await select('select password from users where name=? limit 1',[name]);
                    } catch (error) {
                    }
                    //账号名存在，提示用户重新注册
                    if(selectResult.length==1){
                        sock.write('403 注册账号已存在');
                        break;
                    }
                    //账号名不存在，插入数据库数据，进行注册
                    let addSql = 'insert into users(name,password) values(?,?)';
                    let addSqlParams=[name,password];
                    let addResult;
                    try {
                        addResult=await add(addSql,addSqlParams);
                    } catch (error) {
                    }
                    if(typeof(addResult)=='object'){
                        sock.write('200 注册成功');
                    }else{
                        //注册失败，提示重新注册
                        sock.write('404 注册失败');
                    }
                    break;
                }
                    
                //登录
                case 'LOGIN':{

                    let arr=message.split(' ');
                    //长度不为３，不符合登录格式:login 账号 密码，登录失败，提示重新登录
                    if(arr.length!=3){
                        sock.write('405 账号密码格式不对');
                        return;
                    }
                    //长度为3,继续执行
                    let name=arr[1];
                    let password=arr[2];
                    //判断用户是否为重复登录
                    let k=1;
                    onlineclients.map((user)=>{
                        if(user.name==name){
                            //账号已登录
                            sock.write('407 重新登录');
                            k=0;
                        }
                    });
                    //k由1变为０，重复登录，break
                    if(k==0){
                        break;
                    }
                    let selectresult;//数据库查询结果
                    //连接数据库,按用户名先查找
                    try {
                        selectresult=await select('select password from users where name=? limit 1',[name]);
                    } catch (error) {
                    }
                    //账号名存在，提示用户重新注册
                    if(selectresult.length==1){
                        //账号名存在，但是查询到的密码和用户登录密码不同，登录失败
                        if(selectresult[0].password!=password){
                            sock.write('405 重新登录');
                            return;
                        }
                        //账号密码正确，登录成功
                        sock.write('201 登录成功，现在可以聊天了');
                        console.log(name+'上线');
                        //加入
                        onlineclients.push({sock,name});
                        //群发提示新用户上线
                        onlineclients.map((user)=>{
                            if(name!=user.name){
                                user.sock.write(202+' '+time()+' 用户'+name+'上线');
                            }
                        });
                        console.log("当前在线人数:" + onlineclients.length )
                    }else{
                        sock.write('405 重新登录');
                    }
                    break;
                }
                //群聊
                case 'ALL':{
                    let name;//账号
                    onlineclients.map((user)=>{
                        if(sock==user.sock){name=user.name}
                    });
                    //群发信息
                    onlineclients.map((user)=>{
                        if(sock!=user.sock){
                            user.sock.write('202 '+time()+' '+name+':\n'+message.slice(4));
                        }
                    });
                    break;  
                }

                //私聊
                case '@':{
                    
                    //通过sock获取发信人的账号
                    let name;//账号
                    onlineclients.map((user)=>{
                        if(sock==user.sock){name=user.name}
                    });
                    let receivename=message.split(' ')[1];//收信人账号
                    let realmessage=message.substring(message.indexOf(' ',2)+1);//私聊信息
                    console.log(realmessage);
                    
                    onlineclients.map((user)=>{
                        if(receivename==user.name){
                            user.sock.write('202 '+time()+' '+name+' 私信:\n'+realmessage);
                        }   
                    });
                    break;
                }
                //退出
                case 'quit':{
                    
                    //通过sock获取发信人的账号
                    let name;//账号
                    onlineclients.map((user)=>{
                        if(sock==user.sock){name=user.name}
                    });
                    console.log(name+'下线');
                    sock.write('406');
                    //群通知该用户下线
                    onlineclients.map((user)=>{
                        if(name!=user.name){
                            user.sock.write('202 '+time()+' 用户'+name+'下线');
                        }
                    });
                    //用户下线时，从记录在线人数的数组中删除
                    let num=onlineclients.length;//数组长度
                    onlineclients.map((value,index)=>{
                        if(value.sock==sock){
                            onlineclients.splice(index,1);
                        }
                    });
                    console.log("剩余人数:" + onlineclients.length )
                    break;
                }
            }
        })();
    })
})

//服务器端口号和IP地址
let port = 8210
server.listen(port, '192.168.137.128')
console.log("listen on port: " + port )

//信息发送时间函数
function time(){
    let date=new Date();
    let h=date.getHours();
    if(h<10) h='0'+h;
    let m=date.getMinutes();
    if(m<10) m='0'+m;
    let s=date.getSeconds();
    if(s<10) s='0'+s;
    let t=h+':'+m+':'+s;
    return t;
}
/**
 * 注册，讲账号密码插入数据库
 * @param {*} sql 　插入语句
 * @param {*} params 　账号、密码
 */
async function add(sql, params) {
    //数据库配置
    var connection = mysql.createConnection(sqlBasedata); 
    
    connection.connect();
    return await new Promise((resolve, reject) => {
        connection.query(sql, params, function (error, results) {
            if (error) {
                reject(error);
                return
            }
            resolve(results);
            connection.end();
        })
    });
}

/**
 * 登录时，通过账号名查询账号是否已注册
 * @param {*} sql 　用name查询password的sql语句
 * @param {*} params 　账户名name
 */
async function select(sql, params) {
    
    var connection = mysql.createConnection(sqlBasedata); 
    connection.connect();
    return await new Promise((resolve, reject) => {
        connection.query(sql, params, function (error, results) {
            if (error) {
                reject(error);
                return
            }
            resolve(results);
            connection.end();
        })
    });
}
