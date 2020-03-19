#include <stdio.h>
#include <stdlib.h>

typedef struct 
{
    char *name;     //用户姓名
    int age;               //用户年龄
    char *sex;          //用户性别
    char *phone;   //用户手机号
} User;

void welcome();                   //用户管理界面
User add();                             //增加用户
void find_all(User[],int);  //查找用户
int delete(User[],int);        //删除用户
void update(User[],int);   //修改用户信息

int main()
{
    welcome();
     return 0;
}

//用户管理界面
void welcome(){
    int count=0;        //用户数量，初始值sige
    User user_list[10];         //用于存储用户信息的数组
    User user;
    int handle;                         //接收增删改查的变量
    int m;
    while(1){
        printf("==========欢迎登录用户管理界面==========\n");
        printf("[1].增加新用户\n[2].删除用户\n[3].修改用户信息\n[4].查看所有用户信息\n");
        printf("按照提示输入对应数字进行操作:\n");
        scanf("%d",&handle);
        switch (handle)
        {
            case 1:     //增加新用户
                user=add();
                user_list[count].name=user.name;
                user_list[count].age=user.age;
                user_list[count].sex=user.sex;
                user_list[count].phone=user.phone;
                 count++;
                 printf("用户增加成功！\n");
                break;
            case 2:     //删除用户
                m=delete(user_list,count);
                if(m==1){
                    printf("删除成功！！！\n");
                    printf("-------------------------\n");
                    count--;
                }
                break;
            case 3:     //修改用户信息
                update(user_list,count);
                break;
            case 4:     //查看所有用户信息
                find_all(user_list,count);
                break;
            
            default:
                break;
        }
    }
    free(user.name);
    free(user.sex);
    free(user.phone);  
}

//   增加用户
User add( )
{
    system("clear");
    User user;
    user.name=malloc(sizeof(char));
    user.sex=malloc(sizeof(char));
    user.phone=malloc(sizeof(char));
    printf("---------增加新用户界面--------\n");
    printf("请输入姓名:\n");
    scanf("%s",user.name);
    printf("请输入年龄：\n");
    scanf("%d",&user.age);
    printf("请输入性别:\n");
    scanf("%s",user.sex);
    printf("请输入手机号:\n");
    scanf("%s",user.phone);
    
    return user;
}
// 查找用户
void find_all(User user_list[],int n)
{
    system("clear");
    printf("----------用户查询结果----------\n");
    int i;
    for(i=0;i<n;i++){
        printf("编号：%d  姓名：%s  年龄：%d  性别：%s  手机号：%s\n",i+1,user_list[i].name,user_list[i].age,user_list[i].sex,user_list[i].phone);
    }
    printf("\n");
}
// 删除用户
int  delete(User user_list[],int n){
    system("clear");
    int i,j;
    printf("----------用户删除界面----------\n");
    printf("请输入要删除的用户ID(1~%d)：\n",n);
    scanf("%d",&i);
    for(j=i;j<n;j++){
        user_list[j-1]=user_list[j];
    }
    return 1;
}
//修改用户信息
void update(User user_list[],int n){
    system("clear");
    int i,j;
    printf("----------个人信息修改界面----------\n");
    printf("请输入要修改的用户ID(1~%d):]\n",n);
        scanf("%d",&i);
    int f=1;
    while(f){
        printf("id为[%d]的用户个人信息如下：\n-----------------------\n",i);
        printf("编号：%d  姓名：%s  年龄：%d  性别：%s  手机号：%s\n",i,user_list[i-1].name,user_list[i-1].age,user_list[i-1].sex,user_list[i-1].phone);
        printf("[1].修改姓名\n[2].修改年龄\n[3].修改性别\n[4].修改手机号\n\n请输入要修改内容的编号：\n\n");
        scanf("%d",&j);
        switch (j)
        {
            // 修改用户姓名
            case 1:
               printf("请输入新的姓名：\n");
               scanf("%s", user_list[i-1].name);
                break;
            // 修改用户年龄
            case 2:
            //    printf("请输入新的年龄：\n");
               printf("请输入新的年龄：\n");
               scanf("%d",&user_list[i-1].age);
                break;
            // 修改用户性别
            case 3:
               printf("请输入新的性别：\n");
               scanf("%s", user_list[i-1].sex);
                break;
            // 修改用户手机号
            case 4:
               printf("请输入新的手机号：\n");
               scanf("%s", user_list[i-1].phone);
                break;
            default:
                break;
        }
        printf("----------修改成功！----------\n继续修改请按[1],结束修改，退回管理界面请按[0]\n");
        scanf("%d",&f);
    }
}