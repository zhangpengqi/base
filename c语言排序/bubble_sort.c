#include <stdio.h>
int main()
{
    int arr[9]={2,5,7,1,8,4,3,9,6};
    int i;
    int j;
    int m;
   for(i=9;i>0;i--){
       //内循环，找一组中的最小值，并挪到最后
       for(j=0;j<i-1;j++){
            if(arr[j]<arr[j+1]){
                m=arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=m;
            }else{
                m=arr[j+1];
            }
       }
       //打印每一次内循环的最小值
       printf("%d",arr[i-1]);
   }
}