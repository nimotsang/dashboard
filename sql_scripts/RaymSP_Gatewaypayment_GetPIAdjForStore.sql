USE [Crumpler_Live]
GO
/****** Object:  StoredProcedure [dbo].[RaymSP_Gatewaypayment_GetScheduleForStore]    Script Date: 5/20/2017 12:36:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER OFF
GO





Create procedure [dbo].[RaymSP_Gatewaypayment_GetPIAdjForStore]
/*-------------------------------------------------------------------------------------------------------------------
 Request No.		:                                                        
 Script No.		:   rmSP_XGPC_GetScheduleForStore
 CCM Problem		:                                                        
 CCM Task(s)		:                                                        
 DBA Task		:                                                        
 XML Template		:                                                        
 Request by		:	XGPC                                            
 Made by		:	TCR                                             
 Date			:	May 2006                                       
 Input Variables		:   	               
 Output Variable		:  data set
 Note			: 	
 HISTORY		:	30/08/2012 vpi000 add sum scan qty
					31/08/2012 vd  - added store_code 
---------------------------------------------------------------------------------------------------------------------*/
@pStoreList varchar(8000) ='all',
@pinventschedule_id int=0,
@pType int=0
AS

set nocount on

declare @sql varchar(8000)
create table #temp_storeId
(store_code_id int)
Begin
if (@pStoreList='all')
set @sql= 'select store_code_id from store where store_type='+"'S'"
else
set @sql = 'select store_code_id from store  where store_code_id in ('+ @pStoreList + ')'
End
insert into #temp_storeid (store_code_id)
exec (@sql) 
if(@pType=1)
Begin 
select sch.Store_Code_Id, schd.* from XGPC_InventSchedule_Detail schd inner join XGPC_InventSchedule sch on schd.InventSchedule_Id=sch.InventSchedule_Id
where sch.Store_Code_id in (Select store_code_id from #temp_storeId)

End
Else if(@pType=2)
Begin
-- execution status 
Select
	ex.InventSchedule_Id, InventScheduleExecution_Id, InventSchedule_Date, InventScheduleExecution_Description, InventScheduleExecution_Status
From XGPC_InventSchedule_Execution ex
inner join XGPC_InventSchedule sch on sch.InventSchedule_Id = ex.InventSchedule_Id
where sch.Store_Code_id in (Select store_code_id from #temp_storeId)
End
Else if(@pType=3)
Begin
-- execution status 
Select
	InventSchedule_Id, InventSchedule_Date, sch.InventScheduleStatus_Id,InventScheduleStatus_Code, InventSchedule_Type, Session_Id, sch.Store_Code_Id,
	(select CONVERT(int, isnull( (SUM(qty)),0)) from invent_scanning  where invent_scanning.session_id = sch.Session_Id and invent_scanning.store_code_id = sch.Store_Code_Id ) qty_scan,
	store_code
From XGPC_InventSchedule sch 
inner join XGPC_InventSchedule_Status  stat on stat.InventScheduleStatus_Id = sch.InventScheduleStatus_Id
inner join store on store.store_code_id = sch.Store_Code_Id
where sch.InventSchedule_Id=@pinventschedule_id
End
Else
Begin
Select
	InventSchedule_Id, InventSchedule_Date, sch.InventScheduleStatus_Id,InventScheduleStatus_Code, InventSchedule_Type, Session_Id, sch.Store_Code_Id,
	(select CONVERT(int, isnull( (SUM(qty)),0)) from invent_scanning  where invent_scanning.session_id = sch.Session_Id and invent_scanning.store_code_id = sch.Store_Code_Id ) qty_scan,
	store_code
From XGPC_InventSchedule sch 
inner join XGPC_InventSchedule_Status  stat on stat.InventScheduleStatus_Id = sch.InventScheduleStatus_Id
inner join store on store.store_code_id = sch.Store_Code_Id
where sch.Store_Code_id in (Select store_code_id from #temp_storeId)
Order by InventSchedule_Id
End





