
from rest_framework import serializers


class StudentRegistrationSerializer(serializers.Serializer):

    full_name = serializers.CharField(max_length=100)

    email = serializers.EmailField()

    password = serializers.CharField(
        min_length=8,
        write_only=True
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    college_name = serializers.CharField(max_length=150)

    department = serializers.CharField(max_length=100)

    year_of_study = serializers.IntegerField(
        min_value=1,
        max_value=8
    )

    career_goal = serializers.CharField(max_length=150)

    def validate(self, data):

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return data
class StudentLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )