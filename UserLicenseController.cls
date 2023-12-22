public with sharing class UserLicenseController {

    @AuraEnabled(cacheable=true)
    public static List<UserLicenseWrapper> getLicenseInfo() {
        List<UserLicenseWrapper> result = new List<UserLicenseWrapper>();

        // Assuming you have actual data in your org
        for(UserLicense license : [SELECT LicenseDefinitionKey, Name, Status, TotalLicenses, UsedLicenses FROM UserLicense LIMIT 5]) {
            UserLicenseWrapper wrapper = new UserLicenseWrapper();
            wrapper.LicenseDefinitionKey = license.LicenseDefinitionKey;
            wrapper.Name = license.Name;
            wrapper.Status = license.Status;
            wrapper.TotalLicenses = license.TotalLicenses;
            wrapper.UsedLicenses = license.UsedLicenses;
            wrapper.RemainingLicenses = license.TotalLicenses - license.UsedLicenses;
            result.add(wrapper);
        }

        return result;
    }

    public class UserLicenseWrapper {
        @AuraEnabled public String LicenseDefinitionKey;
        @AuraEnabled public String Name;
        @AuraEnabled public String Status;
        @AuraEnabled public Integer TotalLicenses;
        @AuraEnabled public Integer UsedLicenses;
        @AuraEnabled public Integer RemainingLicenses;
    }
}
