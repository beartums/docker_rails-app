require 'test_helper'

class Api::V1::CategoryGroupRelationshipsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_category_group_relationships_create_url
    assert_response :success
  end

  test "should get show" do
    get api_v1_category_group_relationships_show_url
    assert_response :success
  end

  test "should get update" do
    get api_v1_category_group_relationships_update_url
    assert_response :success
  end

  test "should get destroy" do
    get api_v1_category_group_relationships_destroy_url
    assert_response :success
  end

  test "should get index" do
    get api_v1_category_group_relationships_index_url
    assert_response :success
  end

end
