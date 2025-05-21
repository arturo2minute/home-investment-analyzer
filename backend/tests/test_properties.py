import pytest

def test_get_properties_success(async_client):
    response = async_client.get("/properties?zipcode=97478")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_properties_no_results(async_client):
    response = async_client.get("/properties?zipcode=99999")
    assert response.status_code == 200
    assert response.json() == []

def test_get_properties_missing_zipcode(async_client):
    response = async_client.get("/properties")
    assert response.status_code == 422

def test_get_properties_invalid_zipcode(async_client):
    response = async_client.get("/properties?zipcode=abcde")
    assert response.status_code == 422

