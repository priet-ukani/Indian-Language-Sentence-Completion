# For logging data

import gspread

credentials = {
  "type": "service_account",
  "project_id": "indian-language-completion",
  "private_key_id": "3824f897a11643f7692f6bd372641d03cd40b20b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDEItAgLq7aKS9z\ncHU3KHlBXg1SCDqexVyzurcBRKPKxnzyhJHrb8lldmABS0muiL+LDEv23ppIfbEV\nwUqNWFg1y3izFGOfsOk3nRVagyCZkQAId4BESs6o7npAp703cU+gFDEMadRWkjLO\nsKGwKaIqoWOahxBV5d9Ye/qEU+XDfcZTATAZN78qnwLP6uwwguGgA5Kawq0gXjyb\n9Kj8+PGNHrkDIhfpBNbh2Bxsg+TCEk8l0CE9MEX6cgJocwzRBmMDyei/iICKjVqc\nmrdCGuvY8yk2REeUCOSkOVvfsjgIGO+vUZ+QRLAxJ9d/4Oo15FvPVjgU2MvSVvA6\nLIXEF+b3AgMBAAECggEADfF3oEIRVhsFb4x4GMK81APOqJ1DJZRcQb6tUd7CUiEI\nMulvwjABPkBLFOx4QXshOs5V/CfZCfw9gZFrLl8wbiqX2wtBBdI60iRNp1CZGbGw\nMenk6XXz+RhzAnOqRO2+PmARGJPRb5IXIJB3/iEHkUZF4W9mnuSnmw+9QHkCZYJE\noXH+PSQLx+Ird4EEXGOyhT5JQDUgFNrdlAE5ubX6Z2uWtNK83seNE0t9McbhLTA1\nfquPcaPNzTGzUBmYga9Uma/Ed+8kHJobaXUZPmNp1BSnN7F3lWuxw9fqWZjGFEPS\n3dRS4VON5PLrmpwIt43k65wtnb+tMr8H3r+BryYEMQKBgQDitOuBiVRKGJAvGLoV\n9wF7uUe8mYBqnsnPIeW71S/+VF/Fsqy9Pt989iXGo0foNd1OoWbM+YCzGG5SRYO3\nkLtPTUMxAypGqX9/I3bcj83IP8jNuqfOC5QH0uZC84DZG3JwPV8tau7geJuaG6pU\nmX/zZKOG6hg8lwDtHaaSMq1LuQKBgQDdeqoOqGEgWHLB0haiYwrhpWlxUGrZnNYt\nB9VbN/SukgktbQ/F8tF0W95EIiKadntME5nzi8NisbAj3d769QY2VDSCA33Rfj8k\n9jot6kGytYv7hpAmu8MY9J5PStxGam4rZQYiDT6OeH1DhDZm0X4m8luWhYJcqCya\nVr8u0f8ALwKBgEOvvqzTQr5IrSvSlySdteypufheYE/1Ds3wEfZNxWGK8XlGSnrK\nPdHCcC7pazuycVvbpqTGTZ2rSqz3okb5SGN57vjAOCwWyUE9Zmyd5tPF7381HorP\nPChF2IfeyfaIUleeiz81MRMGD3cokWdm2SPjRUuvswLMFvO0qZn21XTJAoGAGR23\n+0GNAiYFnYU9m9yvdzdS5c7AzzzB7QleYKHP1Zwp/kTH7SLELfXdFszoL6wP/2iZ\npMzMs3yDBQ48Iyl2MuMJsVTEB+XRM1fY8SwHl0SPQ07XOg1A6quS6FsM789R/wnN\n0D7AQVfYnLd5k99d9vy09jTdu7Q2mqoLtDuMN3ECgYEAqZ7fUBMnUDYsIpxSJl5l\n6L8ua2XWiz2pkHW/76EsYm5tdxAg15LjCzbx7VMmltRv1NOXOXDFkifPw4jR0joe\nA3R8get7mqDnffNPcwUfmDBtATp82oRLepeNpuxgltO0jOeTmuf0zQOABMaAFVLP\nfhupMcZzgvjlS+wNY9Q+XRA=\n-----END PRIVATE KEY-----\n",
  "client_email": "indian-language-completion@indian-language-completion.iam.gserviceaccount.com",
  "client_id": "107620141176083893546",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/indian-language-completion%40indian-language-completion.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
gc = gspread.service_account_from_dict(credentials)
sh = gc.open("dass")
worksheet = sh.get_worksheet(0)
worksheet2 = sh.get_worksheet(1)

def log_data(input, output_selected):
    empty_row = len(worksheet.get_all_values())+1
    worksheet.update_cell(empty_row,1,empty_row-1)
    worksheet.update_cell(empty_row,2,input)
    worksheet.update_cell(empty_row,3,output_selected)
    print("Data appended successfully.to cell", empty_row)

def store_received_requests(input_data, num_responses, *responses):
    # Assuming you have already authenticated and obtained the worksheet object
    # worksheet = ... (Get your worksheet object here)

    empty_row = len(worksheet2.get_all_values()) + 1

    # Construct the data to be inserted
    data = [empty_row-1, input_data, num_responses] + list(responses)

    # Update the entire row with the constructed data
    worksheet2.update('A{}:{}'.format(empty_row, chr(65 + len(data) - 1)), [data])

    print("Data appended successfully to row", empty_row)

# Example usage
store_received_requests("Input Data", 3, "Response 1", "Response 2", "Response 3")
