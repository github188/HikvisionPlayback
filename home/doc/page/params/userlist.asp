<div id="UserListHeader" class="textalignright">
    <input id="AddDigitalIpBtn" name="AddDigitalIpBtn" class="button" type="button"  onclick="ia(User).AddNewUser()"/>
    <input id="ModifyUserBtn" name="MdfDigitalIpBtn" class="button" type="button" onclick="ia(User).ModifyUserInfo()" disabled="disabled" />
    <input id="DelUserBtn" name="DelDigitalIpBtn" class="button" type="button"  onclick="ia(User).DelUserInfo()" disabled="disabled" />
</div>
<div id="UserListContent" class="margintop10">
    <table class="bordercollapse widthpersent100" cellspacing="0" cellpadding="0" id="UserTableList" onmousedown="ia(User).SelectUserTd(event)">
        <tr class="height25 bgeaeaea">
            <td class="paddingleft5 borderd7d7d7 width60"><label id="laSerialNumber" name="laSerialNumber"></label></td>
            <td class="paddingleft5 borderd7d7d7 width268"><label id="laUserName" name="geUserName"></label></td>
            <td class="paddingleft5 borderd7d7d7"><label name="laUserType"></label></td>
        </tr>
    </table>
</div>
<div id="UserOperationWnd" class="displaynone"></div>
