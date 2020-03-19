#include <stdio.h>

int quick(int arr[],int left,int right)
{
    int i=left;
    int j=right;
    int p=(left+right)/2;//中间下标的下标值
    int piv=arr[p]; //中间下标的数值参考
    for(;i<j;){
        while(i<p&&arr[i]<piv){
            i++;
        }
        if(i<p){
            arr[p]=arr[i];
            p=i;
        }
        while(p<j&&arr[j]>piv){
            j--;
        }
        if(p<j){
            arr[p]=arr[j];
            p=j;
        }
    }
    arr[p]=piv;
    if(p-left>1){
        quick(arr,left,p-1);
    }
    if(right-p>1){
        quick(arr,p+1,right);
    }
}

int main()
{
     int arr[9]={2,5,7,1,8,4,3,9,6};
     quick(arr,0,8);
     for(int i=0;i<9;i++){
         printf("%d",arr[i]);
     }
}